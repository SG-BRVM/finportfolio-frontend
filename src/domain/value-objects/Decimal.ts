/**
 * Decimal - arithmétique décimale sûre basée sur BigInt.
 *
 * Le backend sérialise tous les montants et quantités financières sous
 * forme de chaînes décimales (`Decimal` Python -> `str`). JavaScript ne
 * doit JAMAIS convertir ces valeurs en `number` pour les manipuler : les
 * flottants IEEE-754 introduisent des erreurs d'arrondi inacceptables en
 * contexte financier (0.1 + 0.2 !== 0.3).
 *
 * Cette classe stocke chaque valeur comme un entier `BigInt` mis à
 * l'échelle (SCALE décimales), ce qui rend les additions, soustractions,
 * multiplications et comparaisons exactes.
 *
 * Aucune dépendance externe : testable en isolation totale.
 */
export class Decimal {
  private static readonly SCALE = 8;
  private static readonly FACTOR = 10n ** BigInt(Decimal.SCALE);

  private constructor(private readonly scaled: bigint) {}

  static zero(): Decimal {
    return new Decimal(0n);
  }

  static fromString(value: string): Decimal {
    const trimmed = value.trim();
    const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(trimmed);
    if (!match) {
      throw new Error(`Decimal invalide : "${value}"`);
    }
    const [, sign, intPart, fracPartRaw = ""] = match;
    const fracPart = (fracPartRaw + "0".repeat(Decimal.SCALE)).slice(0, Decimal.SCALE);
    const magnitude = BigInt(intPart + fracPart);
    const scaled = sign ? -magnitude : magnitude;
    return new Decimal(scaled);
  }

  static fromNumber(value: number): Decimal {
    if (!Number.isFinite(value)) {
      throw new Error(`Decimal invalide (nombre non fini) : "${value}"`);
    }
    return Decimal.fromString(value.toString());
  }

  add(other: Decimal): Decimal {
    return new Decimal(this.scaled + other.scaled);
  }

  subtract(other: Decimal): Decimal {
    return new Decimal(this.scaled - other.scaled);
  }

  multiply(other: Decimal): Decimal {
    // (a * FACTOR) * (b * FACTOR) / FACTOR = ab * FACTOR
    return new Decimal((this.scaled * other.scaled) / Decimal.FACTOR);
  }

  negate(): Decimal {
    return new Decimal(-this.scaled);
  }

  compareTo(other: Decimal): -1 | 0 | 1 {
    if (this.scaled === other.scaled) return 0;
    return this.scaled > other.scaled ? 1 : -1;
  }

  equals(other: Decimal): boolean {
    return this.scaled === other.scaled;
  }

  isZero(): boolean {
    return this.scaled === 0n;
  }

  isNegative(): boolean {
    return this.scaled < 0n;
  }

  isPositive(): boolean {
    return this.scaled > 0n;
  }

  /**
   * Représentation décimale exacte, sans zéros de fin superflus
   * (mais avec au moins `minFractionDigits` décimales).
   */
  toFixed(minFractionDigits = 2): string {
    const negative = this.scaled < 0n;
    const abs = negative ? -this.scaled : this.scaled;
    const str = abs.toString().padStart(Decimal.SCALE + 1, "0");
    const intPart = str.slice(0, str.length - Decimal.SCALE) || "0";
    let fracPart = str.slice(str.length - Decimal.SCALE);

    fracPart = fracPart.slice(0, Math.max(minFractionDigits, 0));
    while (fracPart.length < minFractionDigits) fracPart += "0";

    const body = fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart;
    return negative && abs !== 0n ? `-${body}` : body;
  }

  /** Conversion vers `number` - réservée à l'affichage graphique, jamais au calcul. */
  toNumber(): number {
    return Number(this.toFixed(Decimal.SCALE));
  }

  toString(): string {
    return this.toFixed(2);
  }
}
