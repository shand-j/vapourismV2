import type {I18nBase} from '@shopify/hydrogen';

export function getLocaleFromRequest(request: Request): I18nBase {
  const defaultLocale: I18nBase = {language: 'EN', country: 'GB'};
  const supportedLocales: Partial<Record<I18nBase['country'], I18nBase['language']>> = {
    ES: 'ES',
    FR: 'FR',
    DE: 'DE',
    JP: 'JA',
  };

  const url = new URL(request.url);
  const firstSubdomain = url.hostname
    .split('.')[0]
    ?.toUpperCase() as keyof typeof supportedLocales;

  return supportedLocales[firstSubdomain]
    ? {language: supportedLocales[firstSubdomain], country: firstSubdomain}
    : defaultLocale;
}
