import dns from 'dns/promises';
import net from 'net';
import { config } from './config';

/**
 * SSRF guard for the "publish from a URL" feature. User-supplied URLs are
 * fetched server-side, so without this an attacker could point the server at
 * cloud metadata (169.254.169.254), loopback, or private-network services
 * (`*.railway.internal`) and have the response published to a public page.
 *
 * The guard: only http(s), resolve the host and reject any private/reserved
 * address, follow redirects manually (re-validating each hop), and cap how many
 * bytes we read so a huge remote body can't exhaust memory.
 *
 * Residual risk: DNS rebinding between the check and the connection. The
 * publish path buffers a whole response for one-shot storage, so this pragmatic
 * check closes the realistic attack surface; pinning the resolved IP would
 * require a custom agent and is out of scope here.
 */

const MAX_REDIRECTS = 5;

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function inCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split('/');
  const bits = Number(bitsStr);
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(range) & mask);
}

// Private, loopback, link-local, CGNAT, multicast, and other reserved ranges.
const BLOCKED_V4 = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '224.0.0.0/4',
  '240.0.0.0/4',
];

export function isBlockedIp(ip: string): boolean {
  const kind = net.isIP(ip);
  if (kind === 4) return BLOCKED_V4.some((cidr) => inCidr(ip, cidr));
  if (kind === 6) {
    const lower = ip.toLowerCase();
    // IPv4-mapped (::ffff:a.b.c.d) — validate the embedded v4 address.
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedIp(mapped[1]);
    if (lower === '::1' || lower === '::') return true;
    // fc00::/7 unique-local, fe80::/10 link-local.
    if (/^f[cd]/.test(lower)) return true;
    if (/^fe[89ab]/.test(lower)) return true;
    return false;
  }
  // Not a bare IP (shouldn't happen after dns.lookup) — treat as unsafe.
  return true;
}

/** Throw if the URL is not a public http(s) target we're willing to fetch. */
async function assertPublicUrl(rawUrl: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('invalid url');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('only http(s) urls are allowed');
  }
  const results = await dns.lookup(parsed.hostname, { all: true }).catch(() => {
    throw new Error('could not resolve host');
  });
  if (results.length === 0) throw new Error('could not resolve host');
  for (const { address } of results) {
    if (isBlockedIp(address)) throw new Error('url resolves to a private or reserved address');
  }
}

/**
 * Fetch a user-supplied URL with SSRF protection and a response-size cap.
 * Returns the validated Response (redirects already followed and re-checked).
 */
export async function safeFetch(rawUrl: string, init?: RequestInit): Promise<Response> {
  let current = rawUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(current);
    const res = await fetch(current, { ...init, redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return res;
      current = new URL(location, current).toString();
      continue;
    }
    return res;
  }
  throw new Error('too many redirects');
}

/** Read a response body as text, refusing anything over the configured cap. */
export async function readCappedText(res: Response): Promise<string> {
  return new TextDecoder('utf-8').decode(await readCappedBytes(res));
}

/** Read a response body as bytes, refusing anything over the configured cap. */
export async function readCappedBytes(res: Response): Promise<Buffer> {
  const limit = config.maxHtmlSizeBytes;
  const declared = Number(res.headers.get('content-length'));
  if (declared && declared > limit) throw new Error('remote content too large');

  if (!res.body) return Buffer.alloc(0);
  const reader = res.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > limit) {
      await reader.cancel().catch(() => {});
      throw new Error('remote content too large');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}
