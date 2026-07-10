import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { createRouter } from '../src/routes';
import { FilesystemStorage } from '../src/storage';
import { publishArtifact } from '../src/publish';

describe('Pin API', () => {
  let storage: FilesystemStorage;
  let app: express.Express;

  beforeEach(() => {
    storage = new FilesystemStorage();
    app = express();
    app.use('/', createRouter(storage));
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /publish returns a URL', async () => {
    const res = await request(app)
      .post('/publish')
      .send({ html: '<h1>Hello Pin</h1>', title: 'Test Artifact' });

    expect(res.status).toBe(201);
    expect(res.body.url).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.expiresAt).toBeDefined();
  });

  it('POST /publish rejects empty HTML', async () => {
    const res = await request(app).post('/publish').send({ html: '' });
    expect(res.status).toBe(400);
  });

  it('serves an artifact by subdomain via Host header', async () => {
    const published = await request(app)
      .post('/publish')
      .send({ html: '<p>Secret report</p>' })
      .expect(201);

    const subdomain = published.body.subdomain;
    const res = await request(app)
      .get('/')
      .set('Host', `${subdomain}.localhost`)
      .expect(200);

    expect(res.text).toContain('Secret report');
    expect(res.text).toContain('Published with htmldrop');
  });

  it('serves an artifact by /view/:subdomain path', async () => {
    const result = await publishArtifact(
      { html: '<p>Path fallback</p>' },
      storage
    );
    const res = await request(app).get(`/view/${result.subdomain}`).expect(200);
    expect(res.text).toContain('Path fallback');
    expect(res.headers['x-robots-tag']).toContain('noindex');
  });

  it('allows password protected artifacts', async () => {
    const published = await request(app)
      .post('/publish')
      .send({ html: '<p>Protected</p>', password: 'secret' })
      .expect(201);

    const subdomain = published.body.subdomain;
    await request(app)
      .get('/')
      .set('Host', `${subdomain}.localhost`)
      .expect(401);

    const res = await request(app)
      .get('/?password=secret')
      .set('Host', `${subdomain}.localhost`)
      .expect(200);

    expect(res.text).toContain('Protected');
  });
});
