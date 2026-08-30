import { useQueries } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { Position } from "../../../../domain/entities/Position";
import type { FinancialInstrument } from "../../../../domain/entities/FinancialInstrument";
import { Money } from "../../../../domain/value-objects/Money";
import { usePortfolios } from "./usePortfolios";
import { useInstruments } from "./useInstruments";

export interface ConsolidatedPosition {
  portfolioId: string;
  portfolioName: string;
  instrumentId: string;
  instrument: FinancialInstrument | undefined;
  position: Position;
  /** Valeur de marché de la position (quantité x cours actuel), `null` si l'instrument n'est pas encore chargé. */
  marketValue: Money | null;
  /** Performance de la position par rapport au prix moyen d'acquisition (%), `null` si non calculable. */
  performancePercentage: number | null;
}

/**
 * useConsolidatedPortfolio - agrège, sur tous les portefeuilles persistés
 * en base (voir usePortfolios), les positions et les chiffres de
 * valorisation/performance pour offrir une vue "patrimoine" unique, tous
 * portefeuilles confondus - au lieu du portefeuille unique sélectionné
 * dans le Dashboard.
 *
 * Compose uniquement des hooks/use cases existants (positions,
 * valorisation, pnl, instruments) : aucun nouvel appel réseau côté
 * backend, uniquement de la dérivation d'affichage tenue hors des
 * composants UI.
 */
export function useConsolidatedPortfolio() {
  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();
  const knownPortfolios = portfolios;

  const positionsQueries = useQueries({
    queries: knownPortfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "positions"],
      queryFn: () => container.useCases.portfolios.getPositions.execute(p.id),
    })),
  });
  const valuationQueries = useQueries({
    queries: knownPortfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "valuation"],
      queryFn: () => container.useCases.portfolios.getValuation.execute(p.id),
    })),
  });
  const pnlQueries = useQueries({
    queries: knownPortfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "pnl"],
      queryFn: () => container.useCases.portfolios.getPnl.execute(p.id),
    })),
  });

  const { data: instruments = [], isLoading: areInstrumentsLoading } = useInstruments();
  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));

  const isLoading =
    arePortfoliosLoading ||
    areInstrumentsLoading ||
    positionsQueries.some((q) => q.isLoading) ||
    valuationQueries.some((q) => q.isLoading) ||
    pnlQueries.some((q) => q.isLoading);

  const currency = knownPortfolios[0]?.currency;

  const positions: ConsolidatedPosition[] = knownPortfolios.flatMap((portfolio, index) => {
    const portfolioPositions = positionsQueries[index]?.data ?? [];
    return portfolioPositions.map((position) => {
      const instrument = instrumentsById.get(position.instrumentId);
      const marketValue = instrument ? instrument.currentPrice.multiply(position.quantity) : null;
      const avg = position.averagePrice.toNumber();
      const performancePercentage =
        instrument && avg > 0
          ? ((instrument.currentPrice.amount.toNumber() - avg) / avg) * 100
          : null;
      return {
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        instrumentId: position.instrumentId,
        instrument,
        position,
        marketValue,
        performancePercentage,
      };
    });
  });

  let totalValuation: Money | null = null;
  let totalCash: Money | null = null;
  let totalPnl: Money | null = null;

  if (currency && !isLoading) {
    totalValuation = valuationQueries.reduce<Money>(
      (sum, q) => (q.data ? sum.add(q.data) : sum),
      Money.zero(currency),
    );
    totalCash = knownPortfolios.reduce<Money>(
      (sum, p) => sum.add(p.cashBalance),
      Money.zero(currency),
    );
    totalPnl = pnlQueries.reduce<Money>(
      (sum, q) => (q.data ? sum.add(q.data) : sum),
      Money.zero(currency),
    );
  }

  const totalValue = totalValuation && totalCash ? totalValuation.add(totalCash) : null;
  const costBasis = totalValuation && totalPnl ? totalValuation.subtract(totalPnl) : null;
  const performancePercentage =
    costBasis && !costBasis.isZero() && totalPnl
      ? (totalPnl.amount.toNumber() / costBasis.amount.toNumber()) * 100
      : null;

  const earliestPortfolioDate = knownPortfolios.reduce<Date | null>((earliest, p) => {
    if (!earliest || p.createdAt < earliest) return p.createdAt;
    return earliest;
  }, null);

  return {
    portfolios: knownPortfolios,
    positions,
    instrumentsById,
    totalValue,
    totalValuation,
    totalCash,
    totalPnl,
    performancePercentage,
    earliestPortfolioDate,
    isLoading,
    hasAnyPortfolio: knownPortfolios.length > 0,
  };
}
