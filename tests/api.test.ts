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

  it('POST /publish renders markdown into a reader page', async () => {
    const published = await request(app)
      .post('/publish')
      .send({ markdown: '# My Report\n\nHello **world**' })
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200);
    expect(res.text).toContain('<h1>My Report</h1>');
    expect(res.text).toContain('<strong>world</strong>');
    expect(res.text).toContain('<title>My Report</title>'); // title from first heading
    expect(res.text).toContain('Published with htmldrop');
  });

  it('POST /publish/raw accepts application/pdf and serves it back verbatim', async () => {
    const pdfBytes = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
    const published = await request(app)
      .post('/publish/raw?title=my-doc')
      .set('Content-Type', 'application/pdf')
      .send(pdfBytes)
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200)
      .expect('Content-Type', /application\/pdf/);
    expect(Buffer.compare(res.body, pdfBytes)).toBe(0);
  });

  it('POST /publish/raw accepts images', async () => {
    // 1x1 transparent png
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    const published = await request(app)
      .post('/publish/raw')
      .set('Content-Type', 'image/png')
      .send(png)
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200)
      .expect('Content-Type', /image\/png/);
    expect(Buffer.compare(res.body, png)).toBe(0);
  });

  it('POST /publish/raw renders json as a pretty-printed reader page', async () => {
    const published = await request(app)
      .post('/publish/raw?title=data')
      .set('Content-Type', 'application/json')
      .send('{"a":1,"b":[2,3]}')
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200);
    expect(res.text).toContain('&quot;a&quot;: 1');
    expect(res.text).toContain('<pre>');
  });

  it('POST /publish/raw renders plain text in the reader page', async () => {
    const published = await request(app)
      .post('/publish/raw')
      .set('Content-Type', 'text/plain')
      .send('hello\nworld <tag>')
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200);
    expect(res.text).toContain('hello\nworld &lt;tag&gt;');
  });

  it('POST /publish/raw accepts text/markdown', async () => {
    const published = await request(app)
      .post('/publish/raw')
      .set('Content-Type', 'text/markdown')
      .send('## Raw md\n\n- one\n- two')
      .expect(201);

    const res = await request(app)
      .get(`/view/${published.body.subdomain}`)
      .expect(200);
    expect(res.text).toContain('<h2>Raw md</h2>');
    expect(res.text).toContain('<li>one</li>');
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
