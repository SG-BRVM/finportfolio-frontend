import type { MarketPricesRefreshResult } from "../../domain/entities/MarketPricesRefreshResult";

export interface MarketDataRepository {
  /** Déclenche le scraping manuel (BRVM) et applique les cours obtenus
   * aux instruments correspondants. Opération explicite, à la demande. */
  refreshPrices(): Promise<MarketPricesRefreshResult>;
}
