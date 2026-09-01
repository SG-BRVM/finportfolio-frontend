import type { Decimal } from "../../domain/value-objects/Decimal";
import { getIntlLocale } from "../../infrastructure/i18n/i18n";

/** Formate un Decimal du Domain pour l'affichage d'une quantité. */
export function formatQuantity(quantity: Decimal, locale = getIntlLocale()): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(quantity.toNumber());
}

/**
 * Formate un nombre simple (score de risque, volume de marché, nombre de
 * sessions, ...) qui n'est pas une quantité financière issue du Domain.
 * Pour tout montant ou quantité liée au Domain, préférer `formatCurrency`
 * ou `formatQuantity`, qui opèrent sur `Money`/`Decimal`.
 */
export function formatNumber(
  value: number,
  options: { decimals?: number; locale?: string } = {},
): string {
  const { decimals = 0, locale = getIntlLocale() } = options;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
