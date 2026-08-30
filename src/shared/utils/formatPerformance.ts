import { formatPercentage } from "./formatPercentage";

export type PerformanceDirection = "up" | "down" | "flat";

export interface FormattedPerformance {
  /** "+4,82 %" / "-2,31 %" / "0,00 %" */
  label: string;
  direction: PerformanceDirection;
}

/**
 * Formate une performance (variation en %) et détermine son sens, pour que
 * les composants d'affichage (PerformanceBadge, PerformanceCard, ...)
 * appliquent une couleur cohérente dans toute l'application :
 * vert (hausse), rouge (baisse), gris (stable) - jamais l'inverse.
 */
export function formatPerformance(value: number, decimals = 2): FormattedPerformance {
  const direction: PerformanceDirection = value > 0 ? "up" : value < 0 ? "down" : "flat";
  return { label: formatPercentage(value, { decimals }), direction };
}

/** Classes Tailwind associées à une direction de performance. */
export const PERFORMANCE_DIRECTION_CLASSES: Record<PerformanceDirection, string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-ink-500",
};
