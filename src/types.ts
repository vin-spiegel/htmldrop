export interface ArtifactMeta {
  id: string;
  subdomain: string;
  title?: string;
  html: string;
  /** MIME type the artifact is served with. Defaults to text/html. */
  contentType?: string;
  /** Base64 payload for binary artifacts (pdf, images). `html` is '' then. */
  contentBase64?: string;
  createdAt: string;
  expiresAt: string;
  ownerKey?: string;
  password?: string;
  sourceUrl?: string;
  ogSvg?: string;
  ogTitle?: string;
}

export interface PublishOptions {
  html: string;
  /** Binary payload alternative to `html` (pdf, images). */
  binary?: { data: Buffer; contentType: string };
  title?: string;
  ttlDays?: number;
  password?: string;
  ownerKey?: string;
  sourceUrl?: string;
}

export interface PublishResult {
  id: string;
  url: string;
  subdomain: string;
  expiresAt: string;
}

export interface Storage {
  save(meta: ArtifactMeta): Promise<void>;
  loadBySubdomain(subdomain: string): Promise<ArtifactMeta | null>;
  loadById(id: string): Promise<ArtifactMeta | null>;
  deleteById(id: string): Promise<void>;
}
