import type { MarketDataRepository } from "../../../../application/ports/MarketDataRepository";
import type { MarketPricesRefreshResult } from "../../../../domain/entities/MarketPricesRefreshResult";
import type { HttpClient } from "../axios/HttpClient";
import { MarketDataMapper, type RefreshMarketPricesApiResponse } from "../mappers/MarketDataMapper";

export class HttpMarketDataRepository implements MarketDataRepository {
  constructor(private readonly http: HttpClient) {}

  async refreshPrices(): Promise<MarketPricesRefreshResult> {
    const response = await this.http.post<RefreshMarketPricesApiResponse>(
      "/api/v1/market-data/refresh-prices"
    );
    return MarketDataMapper.toDomain(response);
  }
}
