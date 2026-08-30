import { Decimal } from "./Decimal";
import { Currency } from "./Currency";

/**
 * Money - Value Object représentant un montant financier dans une devise.
 *
 * Règle absolue du domaine : ne jamais représenter un montant financier
 * par un `number` JavaScript. `Money` encapsule un `Decimal` (BigInt mis
 * à l'échelle) et une `Currency`, et refuse toute opération arithmétique
 * entre deux montants de devises différentes.
 */
export class Money {
  private constructor(
    public readonly amount: Decimal,
    public readonly currency: Currency
  ) {}

  static of(amount: Decimal | string, currency: Currency | string): Money {
    const decimal = typeof amount === "string" ? Decimal.fromString(amount) : amount;
    const curr = typeof currency === "string" ? Currency.of(currency) : currency;
    return new Money(decimal, curr);
  }

  static zero(currency: Currency | string): Money {
    return Money.of(Decimal.zero(), currency);
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(
        `Impossible d'opérer sur des devises différentes : ${this.currency} vs ${other.currency}`
      );
    }
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.add(other.amount), this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.subtract(other.amount), this.currency);
  }

  multiply(factor: Decimal): Money {
    return new Money(this.amount.multiply(factor), this.currency);
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  compareTo(other: Money): -1 | 0 | 1 {
    this.assertSameCurrency(other);
    return this.amount.compareTo(other.amount);
  }

  equals(other: Money): boolean {
    return this.currency.equals(other.currency) && this.amount.equals(other.amount);
  }

  /**
   * Formatage lisible : "12 000,00 MAD" (locale française par défaut),
   * ou "12 000 XOF" pour une devise sans décimales (voir `Currency.decimals`).
   */
  format(locale = "fr-FR"): string {
    const decimals = this.currency.decimals();
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
      .format(this.amount.toNumber())
      // Intl utilise une espace fine insécable (U+202F) comme séparateur
      // de milliers en fr-FR ; on la normalise en espace normale pour un
      // rendu et des tests cohérents entre environnements (navigateur/CI).
      .replace(/\u202f/g, " ");
    return `${formatted} ${this.currency.toString()}`;
  }

  toString(): string {
    return this.format();
  }
}
