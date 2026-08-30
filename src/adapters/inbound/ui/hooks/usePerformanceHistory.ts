import { useQueries } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { PerformancePeriod, PerformancePoint } from "../../../../domain/entities/PerformanceHistory";
import { usePortfolios } from "./usePortfolios";

/**
 * usePerformanceHistory - courbe de valorisation totale du patrimoine (tous
 * portefeuilles confondus) sur la période demandée.
 *
 * Chaque portefeuille a sa propre courbe reconstituée côté backend (voir
 * GET /portfolios/{id}/valuation-history), rejouée à partir de ses
 * transactions et de l'historique de prix des instruments - aucune donnée
 * simulée. Pour une période donnée, le backend génère la même grille de
 * dates (même fenêtre, même nombre de points) pour tout portefeuille, donc
 * les séries s'additionnent point à point par index.
 */
export function usePerformanceHistory(period: PerformancePeriod) {
  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();

  const historyQueries = useQueries({
    queries: portfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "valuation-history", period],
      queryFn: () => container.useCases.portfolios.getValuationHistory.execute(p.id, period),
    })),
  });

  const isLoading = arePortfoliosLoading || historyQueries.some((q) => q.isLoading);

  let points: PerformancePoint[] = [];
  if (!isLoading && portfolios.length > 0) {
    const series = historyQueries.map((q) => q.data ?? []);
    const length = Math.min(...series.map((s) => s.length));
    if (Number.isFinite(length) && length > 0) {
      points = Array.from({ length }, (_, i) => ({
        date: series[0][i].date,
        value: series.reduce((sum, s) => sum + s[i].amount.amount.toNumber(), 0),
      }));
    }
  }

  return { points, isLoading };
}
