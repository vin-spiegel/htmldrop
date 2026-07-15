import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { ArtifactMeta, Storage } from './types';
import { config } from './config';
import { publishArtifact } from './publish';
import { markdownToHtml, textToHtml } from './markdown';
import { generatePngOgImage, generateSvgOgImage } from './og-image';

/**
 * A self-contained password page for protected artifacts. The form POSTs the
 * password (so it never lands in the URL), which means the shareable link
 * carries no secret — the viewer types the password here. `action` is where the
 * form posts: on a subdomain entry it's the subdomain root (`/`) so the clean
 * URL is kept after unlock; on the base-domain path fallback it's `/view/<sub>`.
 */
function passwordPageHtml(subdomain: string, action: string, wrong = false): string {
  const err = wrong ? '<p class="err">Hmm, that’s not it — try again.</p>' : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="theme-color" content="#f7f3ea">
<title>Password required</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#f7f3ea; --paper:#ffffff; --ink:#211d18; --muted:#756c60;
    --accent:#e8503a; --accent-soft:rgba(232,80,58,0.12);
    --line:#211d18; --shadow:rgba(33,29,24,0.10);
    --radius-hand:235px 18px 225px 18px / 18px 225px 18px 235px;
    --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    background:var(--bg);color:var(--ink);
    background-image:radial-gradient(rgba(33,29,24,0.05) 1px,transparent 1px);
    background-size:22px 22px;
    font-family:'Nunito',system-ui,-apple-system,"Malgun Gothic","Apple SD Gothic Neo",sans-serif}
  .card{width:min(370px,100%);background:var(--paper);
    border:2px solid var(--line);
    border-radius:24px 235px 22px 245px / 240px 22px 250px 22px;
    box-shadow:6px 7px 0 var(--shadow);padding:34px 30px 26px;text-align:center;
    transform:rotate(-0.6deg)}
  .lock{width:66px;height:66px;margin:0 auto;display:grid;place-items:center;
    border:2px solid var(--line);border-radius:50%;background:var(--accent-soft);
    box-shadow:3px 3px 0 var(--shadow);transform:rotate(1.5deg)}
  h1{font-family:'Gaegu',system-ui,cursive;font-size:2rem;font-weight:700;
    margin:.65rem 0 .1rem;letter-spacing:.01em}
  .sub{color:var(--muted);font-size:.98rem;margin:0 0 1.35rem}
  form{display:flex;flex-direction:column;gap:.7rem}
  input{font-family:'Nunito',sans-serif;background:var(--bg);border:2px solid var(--line);
    border-radius:14px 10px 13px 11px;padding:.85rem 1rem;color:var(--ink);font-size:1rem;
    outline:none;width:100%;box-shadow:inset 2px 2px 0 rgba(33,29,24,0.04)}
  input::placeholder{color:var(--muted)}
  input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  button{font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;cursor:pointer;
    background:var(--accent);color:#fff;border:2px solid var(--line);
    border-radius:var(--radius-hand);padding:.8rem;box-shadow:4px 4px 0 var(--shadow);
    transition:transform .12s ease,box-shadow .12s ease;margin-top:.15rem}
  button:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 var(--shadow)}
  button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--shadow)}
  .err{color:var(--accent);font-weight:700;font-size:.86rem;margin:.15rem 0 0}
  .tag{margin-top:1.15rem;font-family:var(--mono);font-size:.72rem;color:var(--muted);
    letter-spacing:.05em}
  @keyframes shake{10%,90%{transform:translateX(-1px) rotate(-0.6deg)}
    30%,70%{transform:translateX(3px) rotate(-0.6deg)}
    50%{transform:translateX(-4px) rotate(-0.6deg)}}
  .card.wrong{animation:shake .4s ease both}
  @media (prefers-reduced-motion:reduce){.card.wrong{animation:none}button{transition:none}}
</style></head><body>
  <div class="card${wrong ? ' wrong' : ''}">
    <div class="lock">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#211d18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" fill="rgba(232,80,58,0.12)"/>
        <path d="M7.5 10.5 V7.6 a4.5 4.5 0 0 1 9 0 V10.5"/>
        <circle cx="12" cy="15" r="1.5" fill="#e8503a" stroke="none"/>
        <path d="M12 16.3 V18" stroke="#e8503a"/>
      </svg>
    </div>
    <h1>Password required</h1>
    <p class="sub">This artifact is locked. Enter the password to view it.</p>
    <form method="POST" action="${action}">
      <input name="password" type="password" placeholder="Enter password" autofocus required autocomplete="off">
      ${err}
      <button type="submit">Unlock &rarr;</button>
    </form>
    <div class="tag">htmldrop</div>
  </div>
</body></html>`;
}

/** Send an artifact with its stored content type; binary payloads verbatim. */
function sendArtifact(res: Response, meta: ArtifactMeta): void {
  if (meta.contentBase64) {
    res.set('Content-Type', meta.contentType || 'application/octet-stream');
    res.status(200).send(Buffer.from(meta.contentBase64, 'base64'));
    return;
  }
  res.status(200).send(meta.html);
}

export function createRouter(storage: Storage): Router {
  const router = express.Router();

  router.use(express.json({ limit: '30mb' }));
  router.use(express.urlencoded({ extended: true, limit: '30mb' }));
  router.use(
    express.raw({
      type: ['text/html', 'text/markdown', 'text/plain', 'text/csv', 'application/pdf', 'image/*'],
      limit: '30mb',
    })
  );

  // Owner key header: `x-htmldrop-key` is canonical; `x-pin-key` is accepted
  // for backwards compatibility with early clients.
  const ownerKeyOf = (req: Request): string | undefined =>
    (req.headers['x-htmldrop-key'] ?? req.headers['x-pin-key'])?.toString();

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
    keyGenerator: (req: Request) => ownerKeyOf(req) ?? req.ip ?? 'unknown',
  });

  const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    if (ownerKeyOf(req)) return keyLimiter(req, res, next);
    return anonLimiter(req, res, next);
  };

  // Health
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Expose AGENTS.md for other agents to discover MCP usage
  router.get('/agents.md', (_req, res) => {
    // Look next to the compiled output first (build copies AGENTS.md into
    // dist/, which is always present in the deployed image regardless of the
    // builder), then fall back to the repo root for `pnpm dev`.
    const candidates = [
      path.join(__dirname, 'AGENTS.md'),
      path.join(process.cwd(), 'AGENTS.md'),
    ];
    const filePath = candidates.find((p) => fs.existsSync(p));
    if (filePath) {
      res.set('Content-Type', 'text/markdown; charset=utf-8');
      return res.status(200).send(fs.readFileSync(filePath, 'utf-8'));
    }
    res.status(404).send('AGENTS.md not found');
  });

  // Publish JSON — accepts `html` or `markdown` (rendered to the reader shell)
  router.post('/publish', rateLimiter, async (req, res) => {
    try {
      const { html, markdown, title, ttl_days, password, url } = req.body;
      const ownerKey = ownerKeyOf(req);
      let finalHtml = html;
      let finalTitle = title;
      if (!html && typeof markdown === 'string' && markdown.length > 0) {
        const rendered = markdownToHtml(markdown, title);
        finalHtml = rendered.html;
        finalTitle = rendered.title;
      }
      const result = await publishArtifact(
        {
          html: finalHtml,
          title: finalTitle,
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

  // Publish raw content. Supported Content-Types:
  //   text/html        — published as-is
  //   text/markdown    — rendered to the reader page
  //   text/plain, text/csv, application/json — shown as <pre> in the reader page
  //   application/pdf, image/* — stored and served verbatim
  router.post('/publish/raw', rateLimiter, async (req, res) => {
    try {
      const ownerKey = ownerKeyOf(req);
      let title =
        (req.headers['x-htmldrop-title'] ?? req.headers['x-pin-title'])?.toString() ||
        req.query.title?.toString();

      // application/json is consumed by the JSON body parser upstream.
      if (req.is('application/json')) {
        const rendered = textToHtml(JSON.stringify(req.body, null, 2), title, 'json');
        const result = await publishArtifact({ html: rendered.html, title: rendered.title, ownerKey }, storage);
        return res.status(201).json(result);
      }

      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'send html, markdown, text, csv, pdf, or image body' });
      }

      if (req.is('application/pdf') || req.is('image/*')) {
        const contentType = (req.headers['content-type'] || 'application/octet-stream').split(';')[0];
        const result = await publishArtifact(
          { html: '', binary: { data: req.body, contentType }, title, ownerKey },
          storage
        );
        return res.status(201).json(result);
      }

      let html = req.body.toString('utf-8');
      if (req.is('text/markdown')) {
        const rendered = markdownToHtml(html, title);
        html = rendered.html;
        title = rendered.title;
      } else if (req.is('text/plain') || req.is('text/csv')) {
        const rendered = textToHtml(html, title, req.is('text/csv') ? 'csv' : 'text');
        html = rendered.html;
        title = rendered.title;
      }
      const result = await publishArtifact({ html, title, ownerKey }, storage);
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
      const ownerKey = ownerKeyOf(req);
      const response = await fetch(url, {
        headers: { 'User-Agent': 'htmldrop-bot/0.1' },
      });
      if (!response.ok) {
        return res.status(400).json({ error: `fetch failed: ${response.status}` });
      }
      const fetchedType = (response.headers.get('content-type') || '').split(';')[0].trim();
      const common = {
        title,
        ttlDays: ttl_days ? Number(ttl_days) : undefined,
        password,
        ownerKey,
        sourceUrl: url,
      };
      let result;
      if (fetchedType === 'application/pdf' || fetchedType.startsWith('image/')) {
        const data = Buffer.from(await response.arrayBuffer());
        result = await publishArtifact({ html: '', binary: { data, contentType: fetchedType }, ...common }, storage);
      } else if (fetchedType === 'text/markdown') {
        const rendered = markdownToHtml(await response.text(), title);
        result = await publishArtifact({ ...common, html: rendered.html, title: rendered.title }, storage);
      } else {
        result = await publishArtifact({ ...common, html: await response.text() }, storage);
      }
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
          return res.status(401).send(passwordPageHtml(req.params.subdomain, `/view/${encodeURIComponent(req.params.subdomain)}`));
        }
      }

      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      res.set('Cache-Control', 'public, max-age=60');
      sendArtifact(res, meta);
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
        return res.status(401).send(passwordPageHtml(req.params.subdomain, `/view/${encodeURIComponent(req.params.subdomain)}`, true));
      }
      // Password arrived via POST body — don't cache the unlocked view.
      res.set('Cache-Control', 'no-store');
      sendArtifact(res, meta);
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
          // Post back to the subdomain root itself so the clean URL is kept
          // after unlock (the subdomain has its own valid wildcard cert).
          res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
          return res.status(401).send(passwordPageHtml(subdomain, '/'));
        }
      }

      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      res.set('Cache-Control', 'public, max-age=60');
      sendArtifact(res, meta);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(`<h1>Error</h1><p>${message}</p>`);
    }
  });

  // Unlock a subdomain artifact in place — the gate form POSTs the password
  // here, so the address bar stays on the clean subdomain root after unlock.
  router.post('/', async (req, res) => {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (!subdomain || subdomain.includes('localhost') || !isNaN(Number(subdomain)) || host.split(':')[0] === 'localhost') {
      return res.status(404).send('<h1>Not found</h1>');
    }
    try {
      const meta = await storage.loadBySubdomain(subdomain);
      if (!meta) return res.status(404).send('<h1>Not found or expired</h1>');
      res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      if (meta.password && (req.body?.password ?? '') !== meta.password) {
        return res.status(401).send(passwordPageHtml(subdomain, '/', true));
      }
      // Password arrived via POST body — don't cache the unlocked view.
      res.set('Cache-Control', 'no-store');
      sendArtifact(res, meta);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).send(`<h1>Error</h1><p>${message}</p>`);
    }
  });

  return router;
}
