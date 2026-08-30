import type { Position } from "../../../../domain/entities/Position";
import { Decimal } from "../../../../domain/value-objects/Decimal";

/** Forme exacte de la réponse JSON du backend (PositionResponse, snake_case). */
export interface PositionApiResponse {
  portfolio_id: string;
  instrument_id: string;
  quantity: string;
  average_price: string;
}

export class PositionMapper {
  static toDomain(response: PositionApiResponse): Position {
    return {
      portfolioId: response.portfolio_id,
      instrumentId: response.instrument_id,
      quantity: Decimal.fromString(response.quantity),
      averagePrice: Decimal.fromString(response.average_price),
    };
  }
}
