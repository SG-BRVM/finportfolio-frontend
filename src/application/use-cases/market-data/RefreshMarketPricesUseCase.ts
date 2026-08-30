import type { MarketDataRepository } from "../../ports/MarketDataRepository";
import type { MarketPricesRefreshResult } from "../../../domain/entities/MarketPricesRefreshResult";

export class RefreshMarketPricesUseCase {
  constructor(private readonly marketDataRepository: MarketDataRepository) {}

  async execute(): Promise<MarketPricesRefreshResult> {
    return this.marketDataRepository.refreshPrices();
  }
}
