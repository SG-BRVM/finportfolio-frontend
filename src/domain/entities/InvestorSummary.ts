/**
 * InvestorSummary - forme réduite d'un Investor, renvoyée par l'endpoint
 * d'autocomplétion (`GET /api/v1/investors/search`). Ne contient que ce
 * qu'il faut pour afficher une suggestion et récupérer l'id sélectionné.
 */
export interface InvestorSummary {
  readonly id: string;
  readonly name: string;
}
