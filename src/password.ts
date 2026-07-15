import crypto from 'crypto';
import { promisify } from 'util';

/**
 * Artifact passwords protect a shared link, not a user account. The threat we
 * defend against is the stored metadata leaking (R2 bucket / filesystem), which
 * would otherwise expose every password in plaintext. A salted scrypt hash makes
 * that leak useless and resists brute-forcing weak passwords offline.
 *
 * Format: `scrypt$<saltHex>$<keyHex>`. Verification detects legacy plaintext
 * values (artifacts published before hashing) and compares them in constant
 * time; those expire within the max TTL, after which only hashes remain.
 */

const scrypt = promisify(crypto.scrypt);
const PREFIX = 'scrypt';
const KEYLEN = 32;
const SALT_BYTES = 16;

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_BYTES);
  const key = (await scrypt(plain, salt, KEYLEN)) as Buffer;
  return `${PREFIX}$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(
  provided: string | null | undefined,
  stored: string | undefined
): Promise<boolean> {
  if (!stored) return false;
  const input = provided ?? '';

  if (stored.startsWith(`${PREFIX}$`)) {
    const [, saltHex, keyHex] = stored.split('$');
    if (!saltHex || !keyHex) return false;
    const expected = Buffer.from(keyHex, 'hex');
    const actual = (await scrypt(input, Buffer.from(saltHex, 'hex'), expected.length)) as Buffer;
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  }

  // Legacy plaintext value — constant-time compare for back-compat.
  const a = Buffer.from(input, 'utf-8');
  const b = Buffer.from(stored, 'utf-8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
