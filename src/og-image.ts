import { createCanvas, GlobalFonts, Path2D, SKRSContext2D } from '@napi-rs/canvas';
import * as path from 'path';

const interRegular = path.resolve(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff');
const interBold = path.resolve(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff');
const gaeguLatin = path.resolve(__dirname, '../node_modules/@fontsource/gaegu/files/gaegu-latin-700-normal.woff');
const gaeguKorean = path.resolve(__dirname, '../node_modules/@fontsource/gaegu/files/gaegu-korean-700-normal.woff');

// Register embedded fonts so text renders on hosts with no installed fonts.
try {
  GlobalFonts.registerFromPath(interRegular, 'Inter');
  GlobalFonts.registerFromPath(interBold, 'Inter Bold');
  GlobalFonts.registerFromPath(gaeguLatin, 'Gaegu');
  GlobalFonts.registerFromPath(gaeguKorean, 'GaeguKR');
} catch (err) {
  console.error('Failed to register embedded fonts:', err);
}

export function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1];
}

export function generateSvgOgImage(title: string, domain: string): string {
  const safeTitle = escapeXml(title || 'htmldrop artifact');
  const safeDomain = escapeXml(domain);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f3ea"/>
  <g transform="rotate(-0.4 600 315)">
    <rect x="90" y="94" width="1030" height="462" rx="22" fill="rgba(33,29,24,0.12)"/>
    <rect x="80" y="82" width="1030" height="462" rx="22" fill="#fffdf9" stroke="#211d18" stroke-width="5"/>
    <circle cx="126" cy="126" r="8" fill="rgba(33,29,24,0.18)"/>
    <circle cx="154" cy="126" r="8" fill="rgba(33,29,24,0.18)"/>
    <circle cx="182" cy="126" r="8" fill="#e8503a" opacity="0.75"/>
    <line x1="80" y1="156" x2="1110" y2="156" stroke="rgba(33,29,24,0.15)" stroke-width="3"/>
    <path transform="translate(120,190) scale(2)" d="M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z" fill="#e8503a" stroke="#211d18" stroke-width="1.8"/>
    <text x="178" y="228" fill="#211d18" font-family="Gaegu, sans-serif" font-size="36" font-weight="700">htmldrop<tspan fill="#e8503a">.link</tspan></text>
    <text x="124" y="340" fill="#211d18" font-family="Gaegu, sans-serif" font-size="62" font-weight="700">${safeTitle}</text>
    <text x="124" y="486" fill="#e8503a" font-family="monospace" font-size="26" font-weight="700">${safeDomain}</text>
    <text x="1066" y="486" text-anchor="end" fill="#756c60" font-family="sans-serif" font-size="20">Published ${date}</text>
  </g>
  <path d="M1122 44 L1130 68 L1156 68 L1135 84 L1143 110 L1122 92 L1101 110 L1109 84 L1088 68 L1114 68 Z" fill="#fffdf9" stroke="#211d18" stroke-width="4" stroke-linejoin="round"/>
</svg>`;
}

function wrapText(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

const INK = '#211d18';
const CREAM = '#f7f3ea';
const PAPER = '#fffdf9';
const CORAL = '#e8503a';
const MUTED = '#756c60';
const DROPLET_PATH =
  'M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z';

export function generatePngOgImage(title: string, domain: string): Promise<Buffer> {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Cream paper background with the landing's dot grid
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = 'rgba(33,29,24,0.07)';
  for (let gx = 20; gx < 1200; gx += 26) {
    for (let gy = 20; gy < 630; gy += 26) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Hand-placed browser-window card (slight tilt, offset shadow)
  ctx.save();
  ctx.translate(600, 315);
  ctx.rotate(-0.007);
  ctx.translate(-600, -315);
  const cx = 80;
  const cy = 82;
  const cw = 1030;
  const ch = 462;
  ctx.fillStyle = 'rgba(33,29,24,0.12)';
  roundRect(ctx, cx + 10, cy + 12, cw, ch, 22);
  ctx.fill();
  ctx.fillStyle = PAPER;
  roundRect(ctx, cx, cy, cw, ch, 22);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  roundRect(ctx, cx, cy, cw, ch, 22);
  ctx.stroke();

  // Window head: traffic dots + separator
  const dot = (x: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, cy + 44, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  dot(cx + 46, 'rgba(33,29,24,0.18)');
  dot(cx + 74, 'rgba(33,29,24,0.18)');
  dot(cx + 102, 'rgba(232,80,58,0.75)');
  ctx.strokeStyle = 'rgba(33,29,24,0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 74);
  ctx.lineTo(cx + cw, cy + 74);
  ctx.stroke();

  // Droplet logo + wordmark
  ctx.save();
  ctx.translate(cx + 40, cy + 106);
  ctx.scale(2, 2);
  const droplet = new Path2D(DROPLET_PATH);
  ctx.fillStyle = CORAL;
  ctx.fill(droplet);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.stroke(droplet);
  ctx.restore();
  ctx.font = '700 38px Gaegu';
  ctx.fillStyle = INK;
  ctx.fillText('htmldrop', cx + 98, cy + 146);
  const wordmarkWidth = ctx.measureText('htmldrop').width;
  ctx.fillStyle = CORAL;
  ctx.fillText('.link', cx + 98 + wordmarkWidth, cy + 146);

  // Title — Gaegu handwriting, like the landing hero (KR subset + Inter as fallbacks)
  ctx.fillStyle = INK;
  ctx.font = '700 64px Gaegu, GaeguKR, Inter Bold';
  const wrapped = wrapText(ctx, title || 'htmldrop artifact', cw - 100);
  let y = cy + 258;
  for (const line of wrapped) {
    ctx.fillText(line, cx + 44, y);
    y += 76;
  }

  // Bottom row: domain (coral) + date (muted)
  ctx.fillStyle = CORAL;
  ctx.font = '700 26px Inter Bold';
  ctx.fillText(domain, cx + 44, cy + ch - 42);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  ctx.fillStyle = MUTED;
  ctx.font = '20px Inter';
  const dateText = `Published ${date}`;
  ctx.fillText(dateText, cx + cw - 44 - ctx.measureText(dateText).width, cy + ch - 42);
  ctx.restore();

  // Doodle star peeking at the top-right corner
  ctx.beginPath();
  const star: Array<[number, number]> = [
    [1122, 44], [1130, 68], [1156, 68], [1135, 84], [1143, 110],
    [1122, 92], [1101, 110], [1109, 84], [1088, 68], [1114, 68],
  ];
  star.forEach(([sx, sy], i) => (i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)));
  ctx.closePath();
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  return canvas.encode('png').then((data) => Buffer.from(data));
}

function roundRect(ctx: SKRSContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function insertOgImage(html: string, imageUrl: string, title: string): string {
  if (html.includes('<meta property="og:image"')) return html;
  const ogTags = `
<meta property="og:title" content="${escapeHtml(title || 'htmldrop | Published artifact')}">
<meta property="og:description" content="Published artifact via htmldrop">
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">
<meta name="twitter:title" content="${escapeHtml(title || 'htmldrop | Published artifact')}">
`;
  return html.replace(/(<head[\s\S]*?>)/i, `$1${ogTags}`);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
