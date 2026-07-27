/**
 * Reject high-confidence abuse patterns before an artifact is persisted.
 *
 * This is deliberately conservative: a single generic word is never enough
 * to reject a document. Rules either match credentials directly or require a
 * combination that is characteristic of the abuse previously seen in this
 * service.
 */
export function assertSafeHtml(html: string): void {
  const compact = html.replace(/\s+/g, ' ');

  const containsAlipayExecution =
    /AlipayJSBridge/i.test(compact) &&
    /(?:tradePay|alipay\.topupprod\.phone\.create\.order)/i.test(compact);

  const containsKnownPaymentLoader =
    /<script\b[^>]*\bsrc\s*=\s*["']\/pay\.js(?:[?"'])/i.test(compact);

  const containsPc28Gambling =
    /(?:\bPC\s*28\b|\bJND\s*28\b|加拿大\s*28)/i.test(compact) &&
    /(?:预测|預測|投注|下注|开奖|開獎|赔率|賠率|稳赚|盈利|bet|odds)/i.test(compact);

  const containsKnownPhishingRedirect =
    /(?:1ofeachwine\.com|ilonatesthet\.com|705sport\.com|leadgenconcepts\.com)/i.test(compact);

  const containsExternalPasswordForm =
    /<input\b[^>]*\btype\s*=\s*["']?password\b/i.test(compact) &&
    /<form\b[^>]*\baction\s*=\s*["']https?:\/\//i.test(compact);

  const containsEmbeddedJwt =
    /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/.test(compact);

  if (
    containsAlipayExecution ||
    containsKnownPaymentLoader ||
    containsPc28Gambling ||
    containsKnownPhishingRedirect ||
    containsExternalPasswordForm ||
    containsEmbeddedJwt
  ) {
    throw new Error('content rejected by safety policy');
  }
}
