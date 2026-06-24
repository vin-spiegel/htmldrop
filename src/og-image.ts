export function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1];
}

export function generateSvgOgImage(title: string, domain: string): string {
  const safeTitle = escapeXml(title || 'Pin | Published artifact');
  const safeDomain = escapeXml(domain);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1115"/>
      <stop offset="100%" stop-color="#1a1d23"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="20" fill="none" stroke="#f59e0b" stroke-width="4"/>
  <text x="90" y="150" fill="#f59e0b" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600">📌 Pin</text>
  <text x="90" y="240" fill="#e6e6e6" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700">${safeTitle}</text>
  <text x="90" y="540" fill="#888" font-family="monospace" font-size="22">${safeDomain}</text>
  <text x="90" y="580" fill="#888" font-family="system-ui, -apple-system, sans-serif" font-size="18">Published ${date}</text>
</svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function insertOgImage(html: string, imageUrl: string, title: string): string {
  if (html.includes('<meta property="og:image"')) return html;
  const ogTags = `
<meta property="og:title" content="${escapeHtml(title || 'Pin | Published artifact')}">
<meta property="og:description" content="Published artifact via Pin">
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">
`;
  // Insert right after <head>
  return html.replace(/(<head[\s\S]*?>)/i, `$1${ogTags}`);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
