import { getIntlLocale } from "../../infrastructure/i18n/i18n";

/** Formate une Date pour l'affichage (ex. "29 août 2026, 14:32"). */
export function formatDate(date: Date, locale = getIntlLocale()): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(date: Date, locale = getIntlLocale()): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
