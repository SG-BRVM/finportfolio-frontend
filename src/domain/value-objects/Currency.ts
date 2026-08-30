/**
 * Nombre de décimales d'affichage par devise. La plupart des devises
 * gérées (MAD, USD, EUR ...) utilisent 2 décimales (centimes), mais le
 * XOF (franc CFA, devise de règlement de la BRVM) n'est pas subdivisé en
 * pratique : les cours et montants s'expriment en unités entières. Les
 * devises absentes de cette table utilisent 2 décimales par défaut.
 * (Miroir de `_CURRENCY_DECIMALS` côté backend, `app/domain/value_objects/money.py`.)
 */
const CURRENCY_DECIMALS: Record<string, number> = {
  XOF: 0,
  XAF: 0,
};
const DEFAULT_DECIMALS = 2;

/**
 * Currency - code devise ISO 4217 (3 lettres), ex. "XOF", "MAD", "USD".
 * Simple objet de valeur pour éviter de manipuler des `string` nues
 * partout dans le domaine.
 */
export class Currency {
  private constructor(public readonly code: string) {}

  static of(code: string): Currency {
    const normalized = code.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new Error(`Code devise invalide : "${code}"`);
    }
    return new Currency(normalized);
  }

  /** Nombre de décimales à afficher pour cette devise. */
  decimals(): number {
    return CURRENCY_DECIMALS[this.code] ?? DEFAULT_DECIMALS;
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}
