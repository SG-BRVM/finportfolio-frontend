// TEMPORARY MOCK DATA
// L'API n'expose aucun endpoint d'historique de valorisation
// (`GET /portfolios/{id}/valuation` et `/pnl` ne renvoient qu'un instantané
// courant - voir app/adapters/inbound/http/routes/portfolios.py côté
// finportfolio). Remplacer par un vrai use case
// (ex. GetPortfolioValuationHistoryUseCase) lorsque l'API exposera une
// série temporelle.
//
// Isolé ici (src/mocks/) : seul le graphique de la page Performance le
// consomme, pour le tracé de la courbe uniquement. Le point le plus
// récent de la série est toujours calé sur la vraie valeur totale
// actuelle (calculée à partir des vraies positions/valorisations), pour
// que le graphique ne raconte jamais une histoire incohérente avec les
// chiffres réels affichés à côté.

export type PerformancePeriod = "1M" | "3M" | "6M" | "1A" | "3A" | "MAX";

export const PERFORMANCE_PERIODS: { value: PerformancePeriod; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1A", label: "1A" },
  { value: "3A", label: "3A" },
  { value: "MAX", label: "Origine" },
];

const PERIOD_DAYS: Record<PerformancePeriod, number> = {
  "1M": 30,
  "3M": 90,
  "6M": 182,
  "1A": 365,
  "3A": 1095,
  MAX: 1460,
};

export interface PerformancePoint {
  date: Date;
  value: number;
}

/** Génère un nombre pseudo-aléatoire déterministe dans [0, 1) à partir d'une graine entière. */
function seededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function hashSeed(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
  }
  return hash || 1;
}

/**
 * generatePerformanceHistory - marche aléatoire déterministe (même
 * `seedKey` -> même courbe) se terminant exactement sur `currentValue`,
 * pour que le dernier point du graphique corresponde toujours à la
 * valeur réelle actuelle du patrimoine.
 */
export function generatePerformanceHistory(
  currentValue: number,
  period: PerformancePeriod,
  seedKey: string,
): PerformancePoint[] {
  const days = PERIOD_DAYS[period];
  const pointCount = Math.min(days, 90);
  const step = days / pointCount;
  const random = seededRandom(hashSeed(`${seedKey}:${period}`));

  // Marche aléatoire vers l'arrière depuis la valeur actuelle, avec une
  // dérive légèrement négative (le patrimoine part d'une valeur un peu
  // plus basse plus tôt dans le temps, en moyenne, sur des périodes
  // courtes) pour donner une courbe crédible plutôt qu'un bruit pur.
  const raw: number[] = [currentValue];
  let value = currentValue;
  for (let i = 1; i <= pointCount; i += 1) {
    const dailyVolatility = 0.006 * step;
    const shock = (random() - 0.52) * dailyVolatility * value;
    value = Math.max(value - shock, currentValue * 0.5);
    raw.push(value);
  }
  raw.reverse();

  const now = Date.now();
  return raw.map((v, index) => ({
    date: new Date(now - (raw.length - 1 - index) * step * 24 * 60 * 60 * 1000),
    value: v,
  }));
}
