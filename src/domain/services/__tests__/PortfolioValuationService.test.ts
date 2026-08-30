import { describe, it, expect } from "vitest";
import { PortfolioValuationService } from "../PortfolioValuationService";
import { Decimal } from "../../value-objects/Decimal";
import { Money } from "../../value-objects/Money";
import type { Position } from "../../entities/Position";
import type { FinancialInstrument } from "../../entities/FinancialInstrument";

function makeInstrument(id: string, price: string): FinancialInstrument {
  return {
    id,
    symbol: id,
    name: id,
    instrumentType: "STOCK",
    currency: "MAD",
    currentPrice: Money.of(price, "MAD"),
    nominalValue: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  };
}

function makePosition(instrumentId: string, quantity: string, avgPrice: string): Position {
  return {
    portfolioId: "p1",
    instrumentId,
    quantity: Decimal.fromString(quantity),
    averagePrice: Decimal.fromString(avgPrice),
  };
}

describe("PortfolioValuationService", () => {
  it("calcule la valorisation totale sans React, Axios ni backend", () => {
    const instruments = new Map([
      ["iam", makeInstrument("iam", "150")],
      ["bcp", makeInstrument("bcp", "300")],
    ]);
    const positions = [makePosition("iam", "10", "140"), makePosition("bcp", "5", "290")];

    const valuation = PortfolioValuationService.calculate(positions, instruments, "MAD");

    // 10*150 + 5*300 = 1500 + 1500 = 3000
    expect(valuation.toString()).toBe("3 000,00 MAD");
  });

  it("ignore une position dont l'instrument est inconnu plutôt que de planter", () => {
    const instruments = new Map([["iam", makeInstrument("iam", "150")]]);
    const positions = [makePosition("iam", "10", "140"), makePosition("unknown", "5", "290")];

    const valuation = PortfolioValuationService.calculate(positions, instruments, "MAD");
    expect(valuation.toString()).toBe("1 500,00 MAD");
  });

  it("retourne zéro pour un portefeuille sans position", () => {
    const valuation = PortfolioValuationService.calculate([], new Map(), "MAD");
    expect(valuation.isZero()).toBe(true);
  });
});
