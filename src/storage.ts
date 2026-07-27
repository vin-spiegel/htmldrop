import fs from 'fs/promises';
import path from 'path';
import { ArtifactMeta, Storage } from './types';
import { config } from './config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

const DATA_DIR = path.resolve(process.cwd(), 'data');

/** Content payload lives in its own file; the meta JSON only keeps metadata. */
function stripContent(meta: ArtifactMeta): ArtifactMeta {
  // `ownerKey` existed in legacy metadata. Never persist it: it is only needed
  // while calculating the requested tier's expiry and rate limit.
  const { ownerKey: _ownerKey, ...safeMeta } = meta as ArtifactMeta & { ownerKey?: string };
  return { ...safeMeta, html: '', contentBase64: undefined };
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
      if (isExpired(meta.expiresAt)) {
        await this.deleteBySubdomain(subdomain);
        return null;
      }
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
    const entries = await fs.readdir(DATA_DIR).catch(() => [] as string[]);
    for (const entry of entries) {
      if (!entry.endsWith('.json')) continue;
      try {
        const meta: ArtifactMeta = JSON.parse(await fs.readFile(path.join(DATA_DIR, entry), 'utf-8'));
        if (meta.id === id) {
          await this.deleteBySubdomain(meta.subdomain);
          return;
        }
      } catch {
        // Ignore malformed or concurrently deleted metadata.
      }
    }
  }

  async deleteBySubdomain(subdomain: string): Promise<void> {
    await Promise.all([
      fs.unlink(path.join(DATA_DIR, `${subdomain}.json`)).catch(() => {}),
      fs.unlink(path.join(DATA_DIR, `${subdomain}.html`)).catch(() => {}),
    ]);
  }

  async deleteExpired(): Promise<number> {
    const entries = await fs.readdir(DATA_DIR).catch(() => [] as string[]);
    let deleted = 0;
    for (const entry of entries) {
      if (!entry.endsWith('.json')) continue;
      try {
        const meta: ArtifactMeta = JSON.parse(await fs.readFile(path.join(DATA_DIR, entry), 'utf-8'));
        if (isExpired(meta.expiresAt)) {
          await this.deleteBySubdomain(meta.subdomain);
          deleted++;
        }
      } catch {
        // Ignore malformed or concurrently deleted metadata.
      }
    }
    return deleted;
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

      if (isExpired(meta.expiresAt)) {
        await this.deleteBySubdomain(subdomain);
        return null;
      }

      const htmlRes = await this.client.send(
        new GetObjectCommand({ Bucket: config.cfR2Bucket, Key: this.htmlKey(subdomain) })
      );
      if (isBinary(meta)) {
        meta.contentBase64 = (await streamToBuffer(htmlRes.Body)).toString('base64');
        meta.html = '';
      } else {
        meta.html = await streamToString(htmlRes.Body);
      }

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

  async deleteBySubdomain(subdomain: string): Promise<void> {
    await this.client.send(
      new DeleteObjectsCommand({
        Bucket: config.cfR2Bucket,
        Delete: {
          Objects: [
            { Key: this.metaKey(subdomain) },
            { Key: this.htmlKey(subdomain) },
          ],
          Quiet: true,
        },
      })
    );
  }

  async deleteExpired(): Promise<number> {
    let continuationToken: string | undefined;
    const expiredSubdomains: string[] = [];

    do {
      const listed = await this.client.send(
        new ListObjectsV2Command({
          Bucket: config.cfR2Bucket,
          Prefix: 'meta/',
          ContinuationToken: continuationToken,
        })
      );
      const keys = (listed.Contents || [])
        .map((item) => item.Key)
        .filter((key): key is string => Boolean(key));

      let next = 0;
      const workers = Array.from({ length: Math.min(20, keys.length) }, async () => {
        while (next < keys.length) {
          const key = keys[next++];
          try {
            const result = await this.client.send(
              new GetObjectCommand({ Bucket: config.cfR2Bucket, Key: key })
            );
            const meta: ArtifactMeta = JSON.parse(await streamToString(result.Body));
            const subdomain = key.slice('meta/'.length, -'.json'.length);
            if (meta.subdomain === subdomain && isExpired(meta.expiresAt)) {
              expiredSubdomains.push(subdomain);
            }
          } catch {
            // A concurrent request or cleanup may already have removed it.
          }
        }
      });
      await Promise.all(workers);
      continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
    } while (continuationToken);

    const objects = expiredSubdomains.flatMap((subdomain) => [
      { Key: this.metaKey(subdomain) },
      { Key: this.htmlKey(subdomain) },
    ]);
    for (let i = 0; i < objects.length; i += 1000) {
      await this.client.send(
        new DeleteObjectsCommand({
          Bucket: config.cfR2Bucket,
          Delete: { Objects: objects.slice(i, i + 1000), Quiet: true },
        })
      );
    }
    return expiredSubdomains.length;
  }
}

function isExpired(expiresAt: string): boolean {
  const timestamp = Date.parse(expiresAt);
  return Number.isFinite(timestamp) && timestamp <= Date.now();
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
