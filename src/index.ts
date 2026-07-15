import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createRouter } from './routes';
import { FilesystemStorage, R2Storage } from './storage';
import { config, isR2Configured } from './config';
import { mcpGetHandler, mcpPostHandler } from './mcp-sse';
import { PUBLISH_TOOL } from './mcp-handlers';
import {
  DEFAULT_LOCALE,
  Locale,
  SUPPORTED_LOCALES,
  localePath,
  resolveLocale,
} from './locale';
import { generatePngOgImage } from './og-image';
import type { Request, Response } from 'express';

const app = express();

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();
const router = createRouter(storage);

// Trust exactly one proxy hop (Railway's edge). Trusting every hop (`true`)
// lets a client spoof X-Forwarded-For and rotate `req.ip` at will, which would
// defeat the IP-keyed anonymous rate limiter — the only abuse guard on publish.
app.set('trust proxy', 1);

// A request whose Host is a subdomain of the base (e.g. abc.htmldrop.link) is
// an artifact request — landing/SEO routes must not answer it.
function isArtifactHost(req: Request): boolean {
  const host = (req.headers.host || '').split(':')[0];
  const base = config.baseDomain;
  return Boolean(base && base !== 'localhost' && host !== base && host.endsWith('.' + base));
}

// The landing is a static Astro build. Serve its assets (_astro bundles,
// favicon, …) from wherever the build placed them: bundled into dist/landing
// in production, or web/dist during local `astro build`. The locale HTML pages
// are sent by the explicit routes below so /ko stays slash-less and the
// Accept-Language redirect keeps working.
const LANDING_DIR =
  [path.join(__dirname, 'landing'), path.join(process.cwd(), 'web', 'dist')].find((p) =>
    fs.existsSync(p)
  ) ?? path.join(__dirname, 'landing');

app.use(express.static(LANDING_DIR, { index: false }));

function sendLanding(res: Response, file: string): void {
  res.set('Cache-Control', 'public, max-age=300');
  res.sendFile(path.join(LANDING_DIR, file));
}

// Landing page at root. English is the canonical root (and hreflang x-default);
// browsers preferring another supported language are redirected once to the
// locale's own URL (/ko, /ja, …) so every translation has a stable, indexable
// address instead of invisible Accept-Language content negotiation.
app.get('/', (req, res, next) => {
  if (isArtifactHost(req)) return next();
  const locale = resolveLocale(req.headers['accept-language']);
  res.set('Vary', 'Accept-Language');
  if (locale !== DEFAULT_LOCALE) {
    res.set('Cache-Control', 'public, max-age=300');
    return res.redirect(302, localePath(locale));
  }
  res.set('Content-Language', DEFAULT_LOCALE);
  sendLanding(res, 'index.html');
});

// Localized landing pages at /ko, /ja, /zh, /es, /fr, /de.
const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE);
app.get(NON_DEFAULT_LOCALES.map(localePath), (req, res, next) => {
  if (isArtifactHost(req)) return next();
  const locale = req.path.replace(/^\//, '') as Locale;
  res.set('Content-Language', locale);
  sendLanding(res, `${locale}.html`);
});

// robots.txt — artifacts are kept out of search via X-Robots-Tag noindex
// headers (crawling must stay allowed for the noindex to be seen), so robots
// only needs to advertise the sitemap on the base domain.
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=86400');
  if (isArtifactHost(req)) return res.send('User-agent: *\nAllow: /\n');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: https://${config.baseDomain}/sitemap.xml\n`);
});

// sitemap.xml — one entry per locale, cross-annotated with hreflang.
app.get('/sitemap.xml', (req, res, next) => {
  if (isArtifactHost(req)) return next();
  const origin = `https://${config.baseDomain}`;
  const alternates = SUPPORTED_LOCALES.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l === 'zh' ? 'zh-CN' : l}" href="${origin}${localePath(l)}"/>`
  )
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/>`)
    .join('\n');
  const urls = SUPPORTED_LOCALES.map(
    (l) => `  <url>\n    <loc>${origin}${localePath(l)}</loc>\n${alternates}\n  </url>`
  ).join('\n');
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);
});

// Social preview image for the landing page itself (og:image points here).
app.get('/og.png', async (req, res, next) => {
  if (isArtifactHost(req)) return next();
  try {
    const png = await generatePngOgImage('Publish HTML in seconds', config.baseDomain);
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.status(200).send(png);
  } catch (err: unknown) {
    res.status(500).send(err instanceof Error ? err.message : 'og image failed');
  }
});

// Favicon — the coral droplet, served for the landing page and any artifact
// that doesn't ship its own icon.
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z" fill="#e8503a" stroke="#211d18" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 14.8a2.8 2.8 0 0 0 2.4 2.9" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`;
app.get(['/favicon.ico', '/favicon.svg'], (_req, res) => {
  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(FAVICON_SVG);
});

// MCP over SSE at /mcp
app.get('/mcp', (req, res) => {
  mcpGetHandler(req, res);
});
app.post('/mcp', express.json(), async (req, res) => {
  await mcpPostHandler(req, res, req.body);
});

// Static MCP server card so registries (Smithery, etc.) can list the server
// and its tool without a live introspection handshake against the SSE endpoint.
app.get('/.well-known/mcp/server-card.json', (req, res, next) => {
  if (isArtifactHost(req)) return next();
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({
    serverInfo: { name: 'htmldrop', version: '0.1.0' },
    authentication: { required: false },
    tools: [PUBLISH_TOOL],
    resources: [],
    prompts: [],
  });
});

// Rest of the API and viewer routes
app.use('/', router);

app.listen(config.port, () => {
  const local = `http://localhost:${config.port}`;
  const isLocal = !config.baseDomain || config.baseDomain === 'localhost';
  console.log(`htmldrop running at ${isLocal ? local : `https://${config.baseDomain} (${local})`}`);
  console.log(`  Landing  ${local}/`);
  console.log(`  API      POST ${local}/publish`);
  console.log(`  MCP/SSE  ${local}/mcp`);
  console.log(`Storage: ${isR2Configured() ? 'R2' : 'filesystem'}`);
});
