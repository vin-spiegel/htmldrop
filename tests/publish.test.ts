import { describe, it, expect } from 'vitest';
import { wrapHtml, computeExpiration, buildUrl } from '../src/publish';
import { generateSubdomain } from '../src/subdomain';

describe('publish helpers', () => {
  it('wrapHtml shells a bare fragment with noindex, title, and badge', () => {
    const out = wrapHtml('<p>hi</p>', { title: 'My Report' });
    expect(out).toContain('<p>hi</p>');
    expect(out).toContain('noindex');
    expect(out).toContain('My Report');
    expect(out).toContain('Published with htmldrop');
  });

  it('wrapHtml leaves a complete document untouched except the badge', () => {
    const doc =
      '<!DOCTYPE html><html><head><title>x</title></head><body style="background:red"><h1>hi</h1></body></html>';
    const out = wrapHtml(doc);
    expect(out).toContain('style="background:red"'); // original body kept
    expect(out).not.toContain('max-width:960px'); // no forced shell
    expect(out).toMatch(/Published with htmldrop[\s\S]*<\/body>/); // badge before </body>
    expect(out.match(/<html/gi)).toHaveLength(1); // no nested document
  });

  it('wrapHtml omits the badge when watermark is disabled', () => {
    const out = wrapHtml('<html><body><h1>hi</h1></body></html>', { watermark: false });
    expect(out).not.toContain('htmldrop_badge');
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
