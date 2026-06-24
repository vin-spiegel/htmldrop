import dotenv from 'dotenv';
import fs from 'fs';

const envPath = process.env.DOTENV_PATH || '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  baseDomain: process.env.BASE_DOMAIN || 'localhost',
  anonTtlDays: parseInt(process.env.ANON_TTL_DAYS || '7', 10),
  keyTtlDays: parseInt(process.env.KEY_TTL_DAYS || '30', 10),
  maxHtmlSizeBytes: parseInt(process.env.MAX_HTML_SIZE_BYTES || `${5 * 1024 * 1024}`, 10),
  rateLimitAnonPerMinute: parseInt(process.env.RATE_LIMIT_ANON_PER_MINUTE || '10', 10),
  rateLimitKeyPerMinute: parseInt(process.env.RATE_LIMIT_KEY_PER_MINUTE || '60', 10),
  cfR2Endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
  cfR2AccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  cfR2SecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  cfR2Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
  cfR2PublicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '',
  cfApiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  cfZoneId: process.env.CLOUDFLARE_ZONE_ID || '',
};

export function isR2Configured(): boolean {
  return Boolean(
    config.cfR2Endpoint &&
      config.cfR2AccessKeyId &&
      config.cfR2SecretAccessKey &&
      config.cfR2Bucket
  );
}
