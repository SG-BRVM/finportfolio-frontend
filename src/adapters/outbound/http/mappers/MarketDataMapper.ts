import type { MarketPricesRefreshResult } from "../../../../domain/entities/MarketPricesRefreshResult";

/** Forme exacte de la réponse JSON du backend (RefreshMarketPricesResponse). */
export interface RefreshMarketPricesApiResponse {
  updated_count: number;
  updated_symbols: string[];
  unmatched_symbols: string[];
}

export class MarketDataMapper {
  static toDomain(response: RefreshMarketPricesApiResponse): MarketPricesRefreshResult {
    return {
      updatedCount: response.updated_count,
      updatedSymbols: response.updated_symbols,
      unmatchedSymbols: response.unmatched_symbols,
    };
  }
}
