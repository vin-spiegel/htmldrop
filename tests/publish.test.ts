import { describe, it, expect } from 'vitest';
import { wrapHtml, computeExpiration, buildUrl } from '../src/publish';
import { generateSubdomain } from '../src/subdomain';

describe('publish helpers', () => {
  it('wrapHtml inserts noindex and title', () => {
    const out = wrapHtml('<p>hi</p>', { title: 'My Report' });
    expect(out).toContain('<p>hi</p>');
    expect(out).toContain('noindex');
    expect(out).toContain('My Report');
    expect(out).toContain('Published with Pin');
  });

  it('computeExpiration uses anon default', () => {
    const d = computeExpiration();
    const now = new Date();
    expect(d.getTime()).toBeGreaterThan(now.getTime());
  });

  it('buildUrl uses BASE_DOMAIN', () => {
    const url = buildUrl('happy-otter-42');
    expect(url).toContain('happy-otter-42');
  });

  it('generates unique subdomains', () => {
    const s1 = generateSubdomain();
    const s2 = generateSubdomain();
    expect(s1).toMatch(/^[a-z]+-[a-z]+-\d+$/);
    expect(s1).not.toBe(s2);
  });
});
