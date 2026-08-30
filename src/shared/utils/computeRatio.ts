import type { Money } from "../../domain/value-objects/Money";

/**
 * toRatioPercentage - calcule `numerator / denominator * 100`, pour un
 * usage d'AFFICHAGE uniquement (ex. "18,9 % du portefeuille",
 * "+4,82 % de performance").
 *
 * `Money`/`Decimal` interdisent toute opération arithmétique entre
 * devises différentes ou toute conversion `number` utilisée pour un
 * calcul financier (voir Decimal.toNumber). Un ratio affiché à l'écran
 * n'est pas un montant : il ne sera jamais réinjecté dans une écriture
 * comptable, ce qui rend `toNumber()` acceptable ici, à cet unique
 * usage de présentation.
 *
 * Retourne `null` quand le dénominateur est nul (rien à rapporter :
 * portefeuille vide, aucun coût d'acquisition, ...), pour que l'appelant
 * affiche un état neutre ("—") plutôt qu'un NaN ou un 0 % trompeur.
 */
export function toRatioPercentage(numerator: Money, denominator: Money): number | null {
  if (denominator.isZero()) return null;
  return (numerator.amount.toNumber() / denominator.amount.toNumber()) * 100;
}
