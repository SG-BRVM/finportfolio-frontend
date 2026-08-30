// TEMPORARY MOCK DATA
// Il n'existe pas encore d'endpoint d'analyse de risque côté API (pas de
// notion de volatilité, de concentration ou de score de risque dans le
// Domain backend actuel - voir app/domain côté finportfolio).
// Remplacer par le use case + le port applicatifs adéquats
// (ex. GetPortfolioRiskProfileUseCase) lorsque l'API exposera cette
// donnée. Isolé ici (src/mocks/) pour ne jamais fuiter dans les
// composants UI bruts : la carte "Risque" du Dashboard et la page
// "Profil de risque" le consomment.

export type RiskLevel = "low" | "moderate" | "high";

export interface PortfolioRiskProfile {
  level: RiskLevel;
  label: string;
  /** Score de risque sur 100 (plus élevé = plus risqué). */
  score: number;
  /** Volatilité annualisée estimée (%). */
  volatility: number;
  /** Drawdown maximal observé (%). */
  maxDrawdown: number;
}

const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: "Faible",
  moderate: "Modéré",
  high: "Élevé",
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return hash;
}

function deriveRiskProfile(seed: string): PortfolioRiskProfile {
  const hash = hashSeed(seed);
  const score = 45 + (hash % 45); // 45..89
  const level: RiskLevel = score >= 75 ? "high" : score >= 55 ? "moderate" : "low";
  const volatility = 8 + ((hash * 7) % 15); // 8..22 %
  const maxDrawdown = 4 + ((hash * 13) % 13); // 4..16 %

  return { level, label: RISK_LEVEL_LABELS[level], score, volatility, maxDrawdown };
}

/**
 * Dérive un profil de risque déterministe à partir de l'id du
 * portefeuille (plutôt qu'une valeur unique codée en dur), pour que la
 * carte varie de façon crédible d'un portefeuille à l'autre en attendant
 * le vrai calcul côté backend.
 */
export function getPortfolioRiskProfile(portfolioId: string): PortfolioRiskProfile {
  return deriveRiskProfile(portfolioId);
}

/**
 * Profil de risque consolidé, tous portefeuilles connus confondus (page
 * "Profil de risque") : même principe déterministe, appliqué à la
 * combinaison stable des ids de portefeuilles connus.
 */
export function getConsolidatedRiskProfile(portfolioIds: string[]): PortfolioRiskProfile {
  const seed = [...portfolioIds].sort().join(",") || "empty";
  return deriveRiskProfile(seed);
}

