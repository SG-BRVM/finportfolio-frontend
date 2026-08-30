import { describe, it, expect } from "vitest";
import { Money } from "../Money";
import { Decimal } from "../Decimal";

describe("Money", () => {
  it("additionne deux montants de même devise sans erreur d'arrondi flottant", () => {
    const a = Money.of("0.1", "MAD");
    const b = Money.of("0.2", "MAD");
    expect(a.add(b).toString()).toBe("0,30 MAD");
  });

  it("refuse d'additionner deux devises différentes", () => {
    const mad = Money.of("100", "MAD");
    const usd = Money.of("100", "USD");
    expect(() => mad.add(usd)).toThrow();
  });

  it("multiplie un montant par une quantité", () => {
    const price = Money.of("120.50", "MAD");
    const total = price.multiply(Decimal.fromString("10"));
    expect(total.toString()).toBe("1 205,00 MAD");
  });

  it("formate avec séparateur de milliers", () => {
    const money = Money.of("12000", "MAD");
    expect(money.format()).toBe("12 000,00 MAD");
  });

  it("détecte un montant négatif", () => {
    expect(Money.of("-5", "MAD").isNegative()).toBe(true);
    expect(Money.of("5", "MAD").isNegative()).toBe(false);
  });
});
