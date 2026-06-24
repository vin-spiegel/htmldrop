import { ArtifactMeta, PublishOptions, PublishResult } from './types';
import { config } from './config';
import { generateId, generateSubdomain } from './subdomain';

export function computeExpiration(ttlDays?: number, ownerKey?: string): Date {
  const days = ttlDays ?? (ownerKey ? config.keyTtlDays : config.anonTtlDays);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function buildUrl(subdomain: string): string {
  return `https://${subdomain}.${config.baseDomain}`;
}

export function wrapHtml(html: string, opts: { title?: string; watermark?: boolean } = {}): string {
  const title = opts.title || 'Pin | Published artifact';
  const watermark =
    opts.watermark !== false
      ? `<footer style="margin-top:3rem;opacity:.6;font-size:12px;text-align:center;color:#888">Published with Pin · expiring artifact</footer>`
      : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>${escapeHtml(title)}</title>
</head>
<body style="max-width:960px;margin:2rem auto;padding:0 1rem;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#111">
${html}
${watermark}
</body>
</html>`;
}

export async function publishArtifact(
  opts: PublishOptions,
  storage: { save: (m: ArtifactMeta) => Promise<void>; loadBySubdomain: (s: string) => Promise<ArtifactMeta | null> }
): Promise<PublishResult> {
  if (!opts.html || Buffer.byteLength(opts.html, 'utf-8') > config.maxHtmlSizeBytes) {
    throw new Error('HTML too large or empty');
  }

  let subdomain = generateSubdomain();
  // collision avoidance
  for (let i = 0; i < 10; i++) {
    const existing = await storage.loadBySubdomain(subdomain);
    if (!existing) break;
    subdomain = generateSubdomain();
  }

  const id = generateId();
  const expiresAt = computeExpiration(opts.ttlDays, opts.ownerKey);
  const wrapped = wrapHtml(opts.html, { title: opts.title });

  const meta: ArtifactMeta = {
    id,
    subdomain,
    title: opts.title,
    html: wrapped,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    ownerKey: opts.ownerKey,
    password: opts.password,
  };

  await storage.save(meta);

  return {
    id,
    url: buildUrl(subdomain),
    subdomain,
    expiresAt: meta.expiresAt,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
