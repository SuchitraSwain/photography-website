import type { AppLocale } from "@/i18n/routing";
import { isAppLocale, routing } from "@/i18n/routing";

export function resolveLocale(locale?: string | null): AppLocale {
  if (locale && isAppLocale(locale)) {
    return locale;
  }
  return routing.defaultLocale;
}

export function intlLocale(locale: AppLocale): string {
  return locale === "de" ? "de-DE" : "en-US";
}

export function openGraphLocale(locale: AppLocale): string {
  return locale === "de" ? "de_DE" : "en_US";
}
