import { describe, it, expect } from 'vitest';
import { isBlockedIp, safeFetch } from '../src/safe-fetch';

describe('SSRF guard — isBlockedIp', () => {
  it('blocks loopback, private, link-local, and CGNAT v4', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.5.5', '192.168.0.1', '169.254.169.254', '100.64.0.1', '0.0.0.0']) {
      expect(isBlockedIp(ip), ip).toBe(true);
    }
  });

  it('blocks loopback, ULA, link-local, and mapped v6', () => {
    for (const ip of ['::1', '::', 'fc00::1', 'fd12::1', 'fe80::1', '::ffff:127.0.0.1']) {
      expect(isBlockedIp(ip), ip).toBe(true);
    }
  });

  it('allows public addresses', () => {
    for (const ip of ['8.8.8.8', '1.1.1.1', '93.184.216.34', '2606:4700:4700::1111']) {
      expect(isBlockedIp(ip), ip).toBe(false);
    }
  });
});

describe('SSRF guard — safeFetch', () => {
  it('rejects non-http(s) schemes', async () => {
    await expect(safeFetch('file:///etc/passwd')).rejects.toThrow(/http/);
    await expect(safeFetch('ftp://example.com')).rejects.toThrow(/http/);
  });

  it('rejects urls that resolve to private/reserved addresses', async () => {
    await expect(safeFetch('http://127.0.0.1/')).rejects.toThrow(/private or reserved/);
    await expect(safeFetch('http://169.254.169.254/latest/meta-data/')).rejects.toThrow(/private or reserved/);
    await expect(safeFetch('http://localhost:3000/')).rejects.toThrow(/private or reserved/);
    await expect(safeFetch('http://[::1]/')).rejects.toThrow(/private or reserved/);
  });

  it('rejects malformed urls', async () => {
    await expect(safeFetch('not a url')).rejects.toThrow(/invalid url/);
  });
});
