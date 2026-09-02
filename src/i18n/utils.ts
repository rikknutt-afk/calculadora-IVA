import localesConfig from '../config/locales.json';
import uiTranslations from './ui.json';
import faqTranslations from './faq.json';
import commonTranslations from './common.json';

export const defaultLocale = localesConfig.defaultLocale || 'es';
export const supportedLocales = localesConfig.locales;

export type LocaleCode = string;

export function isValidLocale(code: string): boolean {
  return supportedLocales.some((l) => l.code === code);
}

export function getLocaleDir(locale: string): 'ltr' | 'rtl' {
  const match = supportedLocales.find((l) => l.code === locale);
  return (match?.dir as 'ltr' | 'rtl') || 'ltr';
}

export function getOgLocale(locale: string): string {
  const match = supportedLocales.find((l) => l.code === locale);
  return match?.ogLocale || 'es_ES';
}

export function getLocaleFromUrl(url: URL | string): string {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];

  if (potentialLocale && isValidLocale(potentialLocale) && potentialLocale !== defaultLocale) {
    return potentialLocale;
  }
  return defaultLocale;
}

export function getLocalizedUrl(path: string, locale: string): string {
  // Clean path
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  // Remove existing locale prefix if any
  for (const loc of supportedLocales) {
    if (loc.code !== defaultLocale && cleanPath.startsWith(`/${loc.code}/`)) {
      cleanPath = cleanPath.slice(loc.code.length + 1);
      break;
    }
  }

  // Only the root homepage '/' exists across all locales ('/en/', '/fr/', etc.)
  // All other pages (tools, blog, legal, about) are single canonical pages in Spanish
  if (cleanPath === '/' || cleanPath === '//') {
    if (locale === defaultLocale) {
      return '/';
    }
    return `/${locale}/`;
  }

  // Non-homepage pages always link to their canonical Spanish path
  return cleanPath;
}

export function getStaticLocalePaths() {
  return supportedLocales
    .filter((loc) => loc.code !== defaultLocale)
    .map((loc) => ({
      params: { locale: loc.code },
    }));
}

export function useTranslations(locale: string) {
  const fallbackLocale = 'es';

  const ui = (uiTranslations as Record<string, any>)[locale] || (uiTranslations as Record<string, any>)[fallbackLocale] || {};
  const uiFallback = (uiTranslations as Record<string, any>)[fallbackLocale] || {};

  const common = (commonTranslations as Record<string, any>)[locale] || (commonTranslations as Record<string, any>)[fallbackLocale] || {};
  const commonFallback = (commonTranslations as Record<string, any>)[fallbackLocale] || {};

  const faq = (faqTranslations as Record<string, any>)[locale] || (faqTranslations as Record<string, any>)[fallbackLocale] || {};
  const faqFallback = (faqTranslations as Record<string, any>)[fallbackLocale] || {};

  function t(key: string, defaultVal?: string): string {
    // Nested lookup support e.g. 'nav.calculator'
    const parts = key.split('.');
    
    let current: any = { ...ui, ...common };
    let fallbackCurrent: any = { ...uiFallback, ...commonFallback };

    for (const p of parts) {
      if (current && typeof current === 'object' && p in current) {
        current = current[p];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && typeof current === 'string') {
      return current;
    }

    // Try fallback
    for (const p of parts) {
      if (fallbackCurrent && typeof fallbackCurrent === 'object' && p in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[p];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }

    if (fallbackCurrent !== undefined && typeof fallbackCurrent === 'string') {
      return fallbackCurrent;
    }

    return defaultVal || key;
  }

  return {
    t,
    ui: { ...uiFallback, ...ui },
    faq: { ...faqFallback, ...faq },
    common: { ...commonFallback, ...common },
  };
}
