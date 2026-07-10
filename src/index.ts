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
  console.log(`Pin running on port ${config.port}`);
  console.log(`Storage: ${isR2Configured() ? 'R2' : 'filesystem'}`);
});
