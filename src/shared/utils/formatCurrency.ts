import type { Money } from "../../domain/value-objects/Money";
import { getIntlLocale } from "../../infrastructure/i18n/i18n";

/** Formate un Money du Domain pour l'affichage (ex. "12 000 XOF"). */
export function formatCurrency(money: Money, locale = getIntlLocale()): string {
  return money.format(locale);
}
