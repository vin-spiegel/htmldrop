import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { Storage } from './types';
import { config } from './config';
import { publishArtifact } from './publish';
import { generatePngOgImage, generateSvgOgImage } from './og-image';

/**
 * A self-contained password page for protected artifacts. The form POSTs the
 * password (so it never lands in the URL), which means the shareable link
 * (`/view/<subdomain>`) carries no secret — the viewer types the password here.
 */
function passwordPageHtml(subdomain: string, wrong = false): string {
  const sub = encodeURIComponent(subdomain);
  const err = wrong ? '<p class="err">Incorrect password — try again.</p>' : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Password required</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;
    background:#0e1015;color:#e9ecf3;
    font-family:system-ui,"Segoe UI","Malgun Gothic","Apple SD Gothic Neo",sans-serif}
  .card{width:min(360px,100%);background:#161922;border:1px solid #252b3b;
    border-radius:14px;padding:30px 26px;text-align:center}
  .lock{font-size:28px;line-height:1}
  h1{font-size:17px;margin:14px 0 4px;font-weight:600}
  .sub{color:#8b93a7;font-size:13px;margin:0 0 18px}
  form{display:flex;flex-direction:column;gap:11px}
  input{background:#0e1015;border:1px solid #2c3346;border-radius:9px;padding:12px 13px;
    color:#e9ecf3;font-size:14px;outline:none;width:100%}
  input:focus{border-color:#5bc0be}
  button{background:#5bc0be;color:#0e1015;border:0;border-radius:9px;padding:12px;
    font-size:14px;font-weight:600;cursor:pointer}
  button:hover{background:#6fd0ce}
  .err{color:#ef5f6b;font-size:12.5px;margin:2px 0 0}
</style></head><body>
  <div class="card">
    <div class="lock">🔒</div>
    <h1>Password required</h1>
    <p class="sub">This artifact is password protected.</p>
    <form method="POST" action="/view/${sub}">
      <input name="password" type="password" placeholder="Enter password" autofocus required autocomplete="off">
      ${err}
      <button type="submit">View</button>
    </form>
  </div>
</body></html>`;
}

export function createRouter(storage: Storage): Router {
  const router = express.Router();

  router.use(express.json({ limit: '30mb' }));
  router.use(express.urlencoded({ extended: true, limit: '30mb' }));
  router.use(express.raw({ type: 'text/html', limit: '30mb' }));

  const anonLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: config.rateLimitAnonPerMinute,
    standardHeaders: true,
    keyGenerator: (req: Request) => req.ip ?? 'unknown',
  });

  const keyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: config.rateLimitKeyPerMinute,
    standardHeaders: true,
    keyGenerator: (req: Request) => req.headers['x-pin-key']?.toString() ?? req.ip ?? 'unknown',
  });

  const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-pin-key']) return keyLimiter(req, res, next);
    return anonLimiter(req, res, next);
  };

  // Health
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Expose AGENTS.md for other agents to discover MCP usage
  router.get('/agents.md', (_req, res) => {
    const filePath = path.join(process.cwd(), 'AGENTS.md');
    if (fs.existsSync(filePath)) {
      res.set('Content-Type', 'text/markdown; charset=utf-8');
      return res.status(200).send(fs.readFileSync(filePath, 'utf-8'));
    }
    res.status(404).send('AGENTS.md not found');
  });

  // Publish JSON
  router.post('/publish', rateLimiter, async (req, res) => {
    try {
      const { html, title, ttl_days, password, url } = req.body;
      const ownerKey = req.headers['x-pin-key']?.toString();
      const result = await publishArtifact(
        {
          html,
          title,
          ttlDays: ttl_days ? Number(ttl_days) : undefined,
          password,
          ownerKey,
          sourceUrl: url,
        },
        storage
      );
      res.status(201).json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'publish failed';
      res.status(400).json({ error: message });
    }
  });

  // Publish raw HTML
  router.post('/publish/raw', rateLimiter, async (req, res) => {
    try {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'send text/html body' });
      }
      const ownerKey = req.headers['x-pin-key']?.toString();
      const title = req.headers['x-pin-title']?.toString() || req.query.title?.toString();
      const result = await publishArtifact(
        { html: req.body.toString('utf-8'), title, ownerKey },
        storage
      );
      res.status(201).json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'publish failed';
      res.status(400).json({ error: message });
    }
  });

  // Publish from URL
  router.post('/publish/from-url', rateLimiter, async (req, res) => {
    try {
      const { url, title, ttl_days, password } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'url required' });
      }
      const ownerKey = req.headers['x-pin-key']?.toString();
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Pin-Publish-Bot/0.1' },
      });
      if (!response.ok) {
        return res.status(400).json({ error: `fetch failed: ${response.status}` });
      }
      const html = await response.text();
      const result = await publishArtifact(
        {
          html,
          title,
          ttlDays: ttl_days ? Number(ttl_days) : undefined,
          password,
          ownerKey,
          sourceUrl: url,
        },
        storage
      );
      res.status(201).json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'publish from url failed';
      res.status(400).json({ error: message });
    }
  });

  // Password challenge helper
  router.get('/:subdomain/password', async (req, res) => {
    // Could serve a tiny password form. For API-centric use we return a challenge.
    res.status(200).json({ requiresPassword: true, subdomain: req.params.subdomain });
  });

  // Path-based artifact viewer (fallback for Railway default domain SSL limits)
  router.get('/view/:subdomain', async (req, res) => {
    try {
      const meta = await storage.loadBySubdomain(req.params.subdomain);
      if (!meta) return res.status(404).send('<h1>Not found or expired</h1>');

      if (meta.password) {
        // Back-compat: ?password= still works. Otherwise show a real form (which
        // POSTs the password) instead of a bare 401 / requiring it in the URL.
        const query = new URLSearchParams(req.url.split('?')[1] || '');
        if (query.get('password') !== meta.password) {
          res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
          return res.status(401).send(passwordPageHtml(req.params.subdomain));
        }
      }

      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      res.set('Cache-Control', 'public, max-age=60');
      res.status(200).send(meta.html);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(`<h1>Error</h1><p>${message}</p>`);
    }
  });

  // Password form submit (POST from passwordPageHtml) — verifies the password
  // from the request body, so it is never placed in the URL.
  router.post('/view/:subdomain', async (req, res) => {
    try {
      const meta = await storage.loadBySubdomain(req.params.subdomain);
      if (!meta) return res.status(404).send('<h1>Not found or expired</h1>');
      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      if (meta.password && (req.body?.password ?? '') !== meta.password) {
        return res.status(401).send(passwordPageHtml(req.params.subdomain, true));
      }
      // Password arrived via POST body — don't cache the unlocked view.
      res.set('Cache-Control', 'no-store');
      res.status(200).send(meta.html);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(`<h1>Error</h1><p>${message}</p>`);
    }
  });

  // OG image SVG endpoint (path fallback)
  router.get('/og/:subdomain.svg', async (req, res) => {
    try {
      const meta = await storage.loadBySubdomain(req.params.subdomain);
      if (!meta) return res.status(404).send('not found');
      const svg = generateSvgOgImage(meta.ogTitle || meta.title || 'Pin', `${meta.subdomain}.${config.baseDomain}`);
      res.set('Content-Type', 'image/svg+xml');
      res.set('Cache-Control', 'public, max-age=3600');
      res.status(200).send(svg);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(message);
    }
  });

  // OG image PNG endpoint
  router.get('/og/:subdomain.png', async (req, res) => {
    try {
      const meta = await storage.loadBySubdomain(req.params.subdomain);
      if (!meta) return res.status(404).send('not found');
      const png = await generatePngOgImage(meta.ogTitle || meta.title || 'Pin', `${meta.subdomain}.${config.baseDomain}`);
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=3600');
      res.status(200).send(png);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(message);
    }
  });

  // Serve artifact subdomain
  router.get('/', async (req, res) => {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (!subdomain || subdomain.includes('localhost') || !isNaN(Number(subdomain)) || host.split(':')[0] === 'localhost') {
      return res.redirect('/');
    }

    try {
      const meta = await storage.loadBySubdomain(subdomain);
      if (!meta) return res.status(404).send('<h1>Not found or expired</h1>');

      if (meta.ogSvg && req.url.endsWith('/og.svg')) {
        res.set('Content-Type', 'image/svg+xml');
        res.set('Cache-Control', 'public, max-age=3600');
        return res.status(200).send(meta.ogSvg);
      }

      if (req.url.endsWith('/og.png')) {
        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public, max-age=3600');
        return res.status(200).send(await generatePngOgImage(meta.ogTitle || meta.title || 'Pin', `${meta.subdomain}.${config.baseDomain}`));
      }

      if (meta.password) {
        const query = new URLSearchParams(req.url.split('?')[1] || '');
        if (query.get('password') !== meta.password) {
          // The form POSTs to the path-based /view route (valid SSL on the base
          // domain), so the same unlock flow works regardless of entry point.
          res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
          return res.status(401).send(passwordPageHtml(subdomain));
        }
      }

      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      res.set('Cache-Control', 'public, max-age=60');
      res.status(200).send(meta.html);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(`<h1>Error</h1><p>${message}</p>`);
    }
  });

  return router;
}
