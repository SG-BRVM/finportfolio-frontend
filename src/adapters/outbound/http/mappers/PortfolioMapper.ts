import type { Portfolio } from "../../../../domain/entities/Portfolio";
import type { ValuationHistoryPoint } from "../../../../domain/entities/PerformanceHistory";
import { Money } from "../../../../domain/value-objects/Money";

/** Forme exacte de la réponse JSON du backend (PortfolioResponse, snake_case). */
export interface PortfolioApiResponse {
  id: string;
  investor_id: string;
  name: string;
  currency: string;
  cash_balance: string;
  created_at: string;
}

/** Forme exacte de la réponse JSON du backend (MoneyResponse). */
export interface MoneyApiResponse {
  amount: string;
  currency: string;
}

/** Forme exacte d'un point de la réponse JSON du backend (ValuationHistoryPointResponse). */
export interface ValuationHistoryPointApiResponse {
  date: string;
  amount: string;
  currency: string;
}

export class PortfolioMapper {
  static toDomain(response: PortfolioApiResponse): Portfolio {
    return {
      id: response.id,
      investorId: response.investor_id,
      name: response.name,
      currency: response.currency,
      cashBalance: Money.of(response.cash_balance, response.currency),
      createdAt: new Date(response.created_at),
    };
  }

  static moneyToDomain(response: MoneyApiResponse): Money {
    return Money.of(response.amount, response.currency);
  }

  static valuationHistoryPointToDomain(
    response: ValuationHistoryPointApiResponse
  ): ValuationHistoryPoint {
    return {
      date: new Date(response.date),
      amount: Money.of(response.amount, response.currency),
    };
  }
}
