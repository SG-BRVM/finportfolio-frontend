/** MarketPricesRefreshResult - bilan d'une exécution du connecteur de
 * scraping manuel (BRVM). Déclenché à la demande depuis l'écran
 * Instruments : aucune tâche planifiée ne tourne derrière cet appel. */
export interface MarketPricesRefreshResult {
  readonly updatedCount: number;
  readonly updatedSymbols: string[];
  /** Symboles cotés sur la page BRVM mais non suivis comme instrument. */
  readonly unmatchedSymbols: string[];
}
