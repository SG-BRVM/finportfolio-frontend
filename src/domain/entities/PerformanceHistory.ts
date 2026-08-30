import type { Money } from "../value-objects/Money";

/** Fenêtre temporelle de la courbe de performance. Miroir des clés
 * `PERIOD_DAYS` côté backend (voir get_portfolio_valuation_history.py). */
export type PerformancePeriod = "1M" | "3M" | "6M" | "1A" | "3A" | "MAX";

export const PERFORMANCE_PERIODS: { value: PerformancePeriod; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1A", label: "1A" },
  { value: "3A", label: "3A" },
  { value: "MAX", label: "Origine" },
];

/** Un point de la courbe de valorisation, reconstitué côté backend à
 * partir des transactions exécutées et de l'historique de prix des
 * instruments - aucune donnée simulée. */
export interface PerformancePoint {
  date: Date;
  value: number;
}

/** Un point tel que renvoyé par l'API pour un portefeuille donné (montant
 * conservé en Money avant agrégation, pour rester précis en devise). */
export interface ValuationHistoryPoint {
  date: Date;
  amount: Money;
}
