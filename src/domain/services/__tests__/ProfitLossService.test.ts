import { describe, it, expect } from "vitest";
import { ProfitLossService } from "../ProfitLossService";
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

describe("ProfitLossService", () => {
  it("calcule un P&L positif quand le prix courant dépasse le prix moyen", () => {
    const instruments = new Map([["iam", makeInstrument("iam", "150")]]);
    const positions = [makePosition("iam", "10", "140")];

    const pnl = ProfitLossService.calculate(positions, instruments, "MAD");

    // (150 - 140) * 10 = 100
    expect(pnl.toString()).toBe("100,00 MAD");
    expect(pnl.isNegative()).toBe(false);
  });

  it("calcule un P&L négatif quand le prix courant est sous le prix moyen", () => {
    const instruments = new Map([["iam", makeInstrument("iam", "100")]]);
    const positions = [makePosition("iam", "10", "140")];

    const pnl = ProfitLossService.calculate(positions, instruments, "MAD");

    // (100 - 140) * 10 = -400
    expect(pnl.isNegative()).toBe(true);
    expect(pnl.toString()).toBe("-400,00 MAD");
  });
});
