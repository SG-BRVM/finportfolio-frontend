import { getIntlLocale } from "../../infrastructure/i18n/i18n";

/**
 * Formate une variation en pourcentage pour l'affichage (ex. "+4,82 %").
 *
 * `value` est exprimé en pourcentage (4.82, pas 0.0482). Le signe est
 * affiché par défaut pour les variations de performance ("+"/"-") -
 * désactiver `forceSign` pour une part d'allocation (toujours positive,
 * ex. "72,0 %").
 */
export function formatPercentage(
  value: number,
  options: { decimals?: number; forceSign?: boolean; locale?: string } = {},
): string {
  const { decimals = 2, forceSign = true, locale = getIntlLocale() } = options;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: forceSign ? "exceptZero" : "auto",
  }).format(value);
  return `${formatted} %`;
}
