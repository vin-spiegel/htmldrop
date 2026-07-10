import { ArtifactMeta, PublishOptions, PublishResult } from './types';
import { config } from './config';
import { generateId, generateSubdomain } from './subdomain';
import { extractFirstImage, generatePngOgImage, insertOgImage } from './og-image';

export function computeExpiration(ttlDays?: number, ownerKey?: string): Date {
  const days = ttlDays ?? (ownerKey ? config.keyTtlDays : config.anonTtlDays);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function buildUrl(subdomain: string): string {
  return `https://${subdomain}.${config.baseDomain}`;
}

/**
 * Floating attribution badge, injected before `</body>`. `position: fixed`
 * keeps it out of the page flow so it can never break the artifact's layout;
 * the unique id keeps its styles from colliding with page CSS. Idle it's a
 * faded droplet in the bottom-right corner; hovering expands the label.
 */
const BADGE_HTML =
  `<style>#__htmldrop_badge{position:fixed;right:14px;bottom:14px;z-index:2147483000;display:inline-flex;align-items:center;background:rgba(255,253,249,.95);border:1.5px solid #211d18;border-radius:999px;box-shadow:2px 3px 0 rgba(33,29,24,.15);text-decoration:none;color:#211d18;font:600 12px/1 system-ui,-apple-system,sans-serif;opacity:.5;transition:opacity .15s ease}` +
  `#__htmldrop_badge:hover{opacity:1}` +
  `#__htmldrop_badge svg{width:19px;height:19px;margin:6px;flex:none}` +
  `#__htmldrop_badge span{max-width:0;overflow:hidden;white-space:nowrap;transition:max-width .2s ease}` +
  `#__htmldrop_badge:hover span{max-width:170px;padding-right:11px}` +
  `@media print{#__htmldrop_badge{display:none}}</style>` +
  `<a id="__htmldrop_badge" href="https://htmldrop.link" target="_blank" rel="noopener" aria-label="Published with htmldrop">` +
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z" fill="#e8503a" stroke="#211d18" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 14.8a2.8 2.8 0 0 0 2.4 2.9" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>` +
  `<span>Published with htmldrop</span></a>`;

export function wrapHtml(html: string, opts: { title?: string; watermark?: boolean } = {}): string {
  const badge = opts.watermark !== false ? BADGE_HTML : '';

  // A complete document is served untouched — wrapping it in another shell or
  // forcing body styles breaks real layouts. Only the floating badge goes in.
  if (/<!doctype\s+html|<html[\s>]/i.test(html)) {
    if (!badge) return html;
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${badge}</body>`);
    return html + badge;
  }

  // Bare fragments get a minimal readable shell.
  const title = opts.title || 'htmldrop artifact';
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
${badge}
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
  let finalHtml = wrapHtml(opts.html, { title: opts.title });

  const meta: ArtifactMeta = {
    id,
    subdomain,
    title: opts.title,
    html: finalHtml,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    ownerKey: opts.ownerKey,
    password: opts.password,
    sourceUrl: opts.sourceUrl,
    ogTitle: opts.title || 'htmldrop artifact',
  };

  // OG image: prefer first image in HTML, else generate SVG card
  let ogImageUrl = extractFirstImage(opts.html);
  if (!ogImageUrl) {
    ogImageUrl = `https://${config.baseDomain}/og/${subdomain}.png`;
  }
  meta.html = insertOgImage(finalHtml, ogImageUrl, opts.title || 'htmldrop artifact');

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
