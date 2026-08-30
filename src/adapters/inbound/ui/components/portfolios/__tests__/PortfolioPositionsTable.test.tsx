import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PortfolioPositionsTable } from "../PortfolioPositionsTable";
import { Decimal } from "../../../../../../domain/value-objects/Decimal";
import { Money } from "../../../../../../domain/value-objects/Money";
import type { FinancialInstrument } from "../../../../../../domain/entities/FinancialInstrument";

describe("PortfolioPositionsTable", () => {
  it("affiche un état vide quand il n'y a aucune position", () => {
    render(<PortfolioPositionsTable positions={[]} instruments={new Map()} />);
    expect(screen.getByText("Aucune position")).toBeInTheDocument();
  });

  it("affiche le symbole résolu et le prix courant de l'instrument", () => {
    const instrument: FinancialInstrument = {
      id: "instr-1",
      symbol: "IAM",
      name: "Maroc Telecom",
      instrumentType: "STOCK",
      currency: "MAD",
      currentPrice: Money.of("150", "MAD"),
      nominalValue: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    };
    const instruments = new Map([[instrument.id, instrument]]);
    const positions = [
      {
        portfolioId: "p1",
        instrumentId: "instr-1",
        quantity: Decimal.fromString("10"),
        averagePrice: Decimal.fromString("140"),
      },
    ];

    render(<PortfolioPositionsTable positions={positions} instruments={instruments} />);

    expect(screen.getByText("IAM")).toBeInTheDocument();
    expect(screen.getByText("150,00 MAD")).toBeInTheDocument();
  });
});
