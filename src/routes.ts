import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { Storage } from './types';
import { config } from './config';
import { publishArtifact } from './publish';
import { generatePngOgImage, generateSvgOgImage } from './og-image';

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
        const query = new URLSearchParams(req.url.split('?')[1] || '');
        if (query.get('password') !== meta.password) {
          return res.status(401).send(`<h1>Password required</h1>`);
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
      const png = generatePngOgImage(meta.ogTitle || meta.title || 'Pin', `${meta.subdomain}.${config.baseDomain}`);
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
        return res.status(200).send(generatePngOgImage(meta.ogTitle || meta.title || 'Pin', `${meta.subdomain}.${config.baseDomain}`));
      }

      if (meta.password) {
        const query = new URLSearchParams(req.url.split('?')[1] || '');
        if (query.get('password') !== meta.password) {
          return res
            .status(401)
            .send(`<h1>Password required</h1><form>Password: <input name=password type=password></form>`);
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
