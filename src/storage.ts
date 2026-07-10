import fs from 'fs/promises';
import path from 'path';
import { ArtifactMeta, Storage } from './types';
import { config } from './config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const DATA_DIR = path.resolve(process.cwd(), 'data');

/** Content payload lives in its own file; the meta JSON only keeps metadata. */
function stripContent(meta: ArtifactMeta): ArtifactMeta {
  return { ...meta, html: '', contentBase64: undefined };
}

function isBinary(meta: ArtifactMeta): boolean {
  return Boolean(meta.contentBase64) || Boolean(meta.contentType && !meta.contentType.startsWith('text/html'));
}

export class FilesystemStorage implements Storage {
  async save(meta: ArtifactMeta): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const metaPath = path.join(DATA_DIR, `${meta.subdomain}.json`);
    const contentPath = path.join(DATA_DIR, `${meta.subdomain}.html`);
    await fs.writeFile(metaPath, JSON.stringify(stripContent(meta), null, 2));
    if (meta.contentBase64) {
      await fs.writeFile(contentPath, Buffer.from(meta.contentBase64, 'base64'));
    } else {
      await fs.writeFile(contentPath, meta.html);
    }
  }

  async loadBySubdomain(subdomain: string): Promise<ArtifactMeta | null> {
    try {
      const metaPath = path.join(DATA_DIR, `${subdomain}.json`);
      const contentPath = path.join(DATA_DIR, `${subdomain}.html`);
      const raw = await fs.readFile(metaPath, 'utf-8');
      const meta: ArtifactMeta = JSON.parse(raw);
      if (isBinary(meta)) {
        meta.contentBase64 = (await fs.readFile(contentPath)).toString('base64');
        meta.html = '';
      } else {
        meta.html = await fs.readFile(contentPath, 'utf-8');
      }
      if (new Date(meta.expiresAt) < new Date()) return null;
      return meta;
    } catch {
      return null;
    }
  }

  async loadById(id: string): Promise<ArtifactMeta | null> {
    const entries = await fs.readdir(DATA_DIR).catch(() => [] as string[]);
    for (const entry of entries) {
      if (!entry.endsWith('.json')) continue;
      const raw = await fs.readFile(path.join(DATA_DIR, entry), 'utf-8');
      const meta: ArtifactMeta = JSON.parse(raw);
      if (meta.id === id) return this.loadBySubdomain(meta.subdomain);
    }
    return null;
  }

  async deleteById(id: string): Promise<void> {
    const meta = await this.loadById(id);
    if (!meta) return;
    await fs.unlink(path.join(DATA_DIR, `${meta.subdomain}.json`)).catch(() => {});
    await fs.unlink(path.join(DATA_DIR, `${meta.subdomain}.html`)).catch(() => {});
  }
}

export class R2Storage implements Storage {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: config.cfR2Endpoint,
      credentials: {
        accessKeyId: config.cfR2AccessKeyId,
        secretAccessKey: config.cfR2SecretAccessKey,
      },
    });
  }

  private metaKey(subdomain: string): string {
    return `meta/${subdomain}.json`;
  }

  private htmlKey(subdomain: string): string {
    return `html/${subdomain}.html`;
  }

  async save(meta: ArtifactMeta): Promise<void> {
    const metaKey = this.metaKey(meta.subdomain);
    const htmlKey = this.htmlKey(meta.subdomain);

    await this.client.send(
      new PutObjectCommand({
        Bucket: config.cfR2Bucket,
        Key: metaKey,
        Body: JSON.stringify(stripContent(meta)),
        ContentType: 'application/json',
      })
    );

    await this.client.send(
      new PutObjectCommand({
        Bucket: config.cfR2Bucket,
        Key: htmlKey,
        Body: meta.contentBase64 ? Buffer.from(meta.contentBase64, 'base64') : meta.html,
        ContentType: meta.contentType || 'text/html',
      })
    );
  }

  async loadBySubdomain(subdomain: string): Promise<ArtifactMeta | null> {
    try {
      const metaRes = await this.client.send(
        new GetObjectCommand({ Bucket: config.cfR2Bucket, Key: this.metaKey(subdomain) })
      );
      const raw = await streamToString(metaRes.Body);
      const meta: ArtifactMeta = JSON.parse(raw);

      const htmlRes = await this.client.send(
        new GetObjectCommand({ Bucket: config.cfR2Bucket, Key: this.htmlKey(subdomain) })
      );
      if (isBinary(meta)) {
        meta.contentBase64 = (await streamToBuffer(htmlRes.Body)).toString('base64');
        meta.html = '';
      } else {
        meta.html = await streamToString(htmlRes.Body);
      }

      if (new Date(meta.expiresAt) < new Date()) return null;
      return meta;
    } catch {
      return null;
    }
  }

  async loadById(id: string): Promise<ArtifactMeta | null> {
    // Simple list-less approach: not ideal at scale but works for MVP.
    // For now return null; management endpoints can use subdomain.
    return null;
  }

  async deleteById(id: string): Promise<void> {
    // No-op without listing; deletion by subdomain preferred.
  }
}

async function streamToBuffer(stream: unknown): Promise<Buffer> {
  if (stream instanceof ReadableStream) {
    const reader = stream.getReader();
    const chunks: Buffer[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks);
  }
  // Node.js stream fallback
  const chunks: Buffer[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const chunk of stream as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function streamToString(stream: unknown): Promise<string> {
  return (await streamToBuffer(stream)).toString('utf-8');
}
