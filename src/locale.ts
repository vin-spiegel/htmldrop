/**
 * Locale detection + the URL scheme for the landing pages.
 *
 * The pages themselves are built by Astro (see web/); the Express server only
 * needs to resolve the visitor's preferred locale and map each locale to its
 * URL so it can serve the right static page and redirect from the root.
 */
export type Locale = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de';

export const DEFAULT_LOCALE: Locale = 'en';

const SUPPORTED: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'];

export const SUPPORTED_LOCALES: readonly Locale[] = SUPPORTED;

/** URL path each locale lives at. English is the root (and the x-default). */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/**
 * Resolve the best supported locale from an `Accept-Language` header value.
 * Parses quality values, sorts by preference, and matches on the primary
 * language subtag (so `en-US`, `en-GB` → `en`; any `zh-*` → `zh`).
 */
export function resolveLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === '*') return DEFAULT_LOCALE;
    const primary = tag.split('-')[0] as Locale;
    if (SUPPORTED.includes(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}
