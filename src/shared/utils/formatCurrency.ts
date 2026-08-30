import type { Money } from "../../domain/value-objects/Money";

/** Formate un Money du Domain pour l'affichage (ex. "12 000 XOF"). */
export function formatCurrency(money: Money, locale = "fr-FR"): string {
  return money.format(locale);
}
