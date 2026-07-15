import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/password';

describe('password hashing', () => {
  it('hashes to the scrypt format, not plaintext', async () => {
    const hash = await hashPassword('secret');
    expect(hash).toMatch(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
    expect(hash).not.toContain('secret');
  });

  it('salts: same password hashes differently each time', async () => {
    expect(await hashPassword('secret')).not.toBe(await hashPassword('secret'));
  });

  it('verifies a correct password and rejects a wrong one', async () => {
    const hash = await hashPassword('secret');
    expect(await verifyPassword('secret', hash)).toBe(true);
    expect(await verifyPassword('nope', hash)).toBe(false);
    expect(await verifyPassword('', hash)).toBe(false);
    expect(await verifyPassword(null, hash)).toBe(false);
  });

  it('still accepts legacy plaintext-stored passwords (back-compat)', async () => {
    expect(await verifyPassword('legacy', 'legacy')).toBe(true);
    expect(await verifyPassword('wrong', 'legacy')).toBe(false);
  });

  it('never matches when nothing is stored', async () => {
    expect(await verifyPassword('anything', undefined)).toBe(false);
  });
});
