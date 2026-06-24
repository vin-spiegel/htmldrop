export interface ArtifactMeta {
  id: string;
  subdomain: string;
  title?: string;
  html: string;
  createdAt: string;
  expiresAt: string;
  ownerKey?: string;
  password?: string;
}

export interface PublishOptions {
  html: string;
  title?: string;
  ttlDays?: number;
  password?: string;
  ownerKey?: string;
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
