import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { Storage } from './types';
import { config } from './config';
import { publishArtifact } from './publish';

export function createRouter(storage: Storage): Router {
  const router = express.Router();

  router.use(express.json({ limit: '10mb' }));
  router.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

  // Publish
  router.post('/publish', rateLimiter, async (req, res) => {
    try {
      const { html, title, ttl_days, password } = req.body;
      const ownerKey = req.headers['x-pin-key']?.toString();
      const result = await publishArtifact(
        { html, title, ttlDays: ttl_days ? Number(ttl_days) : undefined, password, ownerKey },
        storage
      );
      res.status(201).json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'publish failed';
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

  // Serve artifact subdomain
  router.get('/', async (req, res) => {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (!subdomain || subdomain.includes('localhost') || !isNaN(Number(subdomain))) {
      return res.status(200).send(`<h1>Pin</h1><p>Agent-native HTML publishing. POST /publish to deploy an artifact.</p>`);
    }

    try {
      const meta = await storage.loadBySubdomain(subdomain);
      if (!meta) return res.status(404).send('<h1>Not found or expired</h1>');

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
