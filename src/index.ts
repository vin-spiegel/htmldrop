import 'dotenv/config';
import express from 'express';
import { createRouter } from './routes';
import { FilesystemStorage, R2Storage } from './storage';
import { config, isR2Configured } from './config';
import { mcpGetHandler, mcpPostHandler } from './mcp-sse';
import { landingPageHtml, resolveLocale } from './landing';

const app = express();

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();
const router = createRouter(storage);

app.set('trust proxy', true);

// Landing page at root — but ONLY on the base domain. A request whose Host is a
// subdomain of the base (e.g. abc.htmldrop.link) is an artifact request, so hand
// it off to the artifact router below instead of showing the landing page.
app.get('/', (req, res, next) => {
  const host = (req.headers.host || '').split(':')[0];
  const base = config.baseDomain;
  if (base && base !== 'localhost' && host !== base && host.endsWith('.' + base)) {
    return next();
  }
  const locale = resolveLocale(req.headers['accept-language']);
  res.set('Cache-Control', 'public, max-age=300');
  res.set('Vary', 'Accept-Language');
  res.set('Content-Language', locale);
  res.status(200).send(landingPageHtml(locale));
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
