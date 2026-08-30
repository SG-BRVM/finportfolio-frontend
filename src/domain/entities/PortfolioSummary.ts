/**
 * PortfolioSummary - forme réduite d'un Portfolio, renvoyée par l'endpoint
 * d'autocomplétion (`GET /api/v1/portfolios/search`).
 */
export interface PortfolioSummary {
  readonly id: string;
  readonly name: string;
  readonly investorId: string;
  readonly currency: string;
}
