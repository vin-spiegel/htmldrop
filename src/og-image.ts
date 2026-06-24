import { createCanvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas';
import * as path from 'path';

const interRegular = path.resolve(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff');
const interBold = path.resolve(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff');

// Register embedded Inter fonts so text renders on hosts with no installed fonts.
try {
  GlobalFonts.registerFromPath(interRegular, 'Inter');
  GlobalFonts.registerFromPath(interBold, 'Inter Bold');
} catch (err) {
  console.error('Failed to register embedded Inter font:', err);
}

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
  <text x="90" y="150" fill="#f59e0b" font-family="sans-serif" font-size="28" font-weight="600">Pin</text>
  <text x="90" y="260" fill="#e6e6e6" font-family="sans-serif" font-size="48" font-weight="700">${safeTitle}</text>
  <text x="90" y="540" fill="#888" font-family="monospace" font-size="22">${safeDomain}</text>
  <text x="90" y="580" fill="#888" font-family="sans-serif" font-size="18">Published ${date}</text>
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

export function generatePngOgImage(title: string, domain: string): Promise<Buffer> {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0f1115');
  gradient.addColorStop(1, '#1a1d23');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Doodle border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  roundRect(ctx, 60, 60, 1080, 510, 20);
  ctx.stroke();

  // Logo
  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 28px Inter';
  ctx.fillText('Pin', 90, 150);

  // Title
  ctx.fillStyle = '#e6e6e6';
  ctx.font = '700 48px Inter Bold';
  const wrapped = wrapText(ctx, title || 'Pin | Published artifact', 980);
  let y = 260;
  for (const line of wrapped) {
    ctx.fillText(line, 90, y);
    y += 64;
  }

  // Domain
  ctx.fillStyle = '#888888';
  ctx.font = '22px monospace';
  ctx.fillText(domain, 90, 540);

  // Date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  ctx.font = '18px sans-serif';
  ctx.fillText(`Published ${date}`, 90, 580);

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
<meta property="og:title" content="${escapeHtml(title || 'Pin | Published artifact')}">
<meta property="og:description" content="Published artifact via Pin">
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">
<meta name="twitter:title" content="${escapeHtml(title || 'Pin | Published artifact')}">
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
