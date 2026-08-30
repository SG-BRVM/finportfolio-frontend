import type { PortfolioRepository } from "../../../../application/ports/PortfolioRepository";
import type { CreatePortfolioDTO } from "../../../../application/dto/CreatePortfolioDTO";
import type { CashOperationDTO } from "../../../../application/dto/CashOperationDTO";
import type { Portfolio } from "../../../../domain/entities/Portfolio";
import type { PortfolioSummary } from "../../../../domain/entities/PortfolioSummary";
import type { Position } from "../../../../domain/entities/Position";
import type { Order } from "../../../../domain/entities/Order";
import type { Transaction } from "../../../../domain/entities/Transaction";
import type { ValuationHistoryPoint, PerformancePeriod } from "../../../../domain/entities/PerformanceHistory";
import type { Money } from "../../../../domain/value-objects/Money";
import type { HttpClient } from "../axios/HttpClient";
import { PortfolioMapper, type PortfolioApiResponse, type MoneyApiResponse, type ValuationHistoryPointApiResponse } from "../mappers/PortfolioMapper";
import { PositionMapper, type PositionApiResponse } from "../mappers/PositionMapper";
import { OrderMapper, type OrderApiResponse, type TransactionApiResponse } from "../mappers/OrderMapper";

/** Forme exacte de la réponse JSON du backend pour l'autocomplétion. */
interface PortfolioSummaryApiResponse {
  id: string;
  name: string;
  investor_id: string;
  currency: string;
}

export class HttpPortfolioRepository implements PortfolioRepository {
  constructor(private readonly http: HttpClient) {}

  async create(data: CreatePortfolioDTO): Promise<Portfolio> {
    const response = await this.http.post<PortfolioApiResponse>("/api/v1/portfolios", {
      investor_id: data.investorId,
      name: data.name,
      currency: data.currency,
    });
    return PortfolioMapper.toDomain(response);
  }

  async getById(id: string): Promise<Portfolio> {
    const response = await this.http.get<PortfolioApiResponse>(`/api/v1/portfolios/${id}`);
    return PortfolioMapper.toDomain(response);
  }

  async getPositions(portfolioId: string): Promise<Position[]> {
    const response = await this.http.get<PositionApiResponse[]>(
      `/api/v1/portfolios/${portfolioId}/positions`
    );
    return response.map(PositionMapper.toDomain);
  }

  async getValuation(portfolioId: string): Promise<Money> {
    const response = await this.http.get<MoneyApiResponse>(
      `/api/v1/portfolios/${portfolioId}/valuation`
    );
    return PortfolioMapper.moneyToDomain(response);
  }

  async getPnl(portfolioId: string): Promise<Money> {
    const response = await this.http.get<MoneyApiResponse>(
      `/api/v1/portfolios/${portfolioId}/pnl`
    );
    return PortfolioMapper.moneyToDomain(response);
  }

  async getValuationHistory(
    portfolioId: string,
    period: PerformancePeriod
  ): Promise<ValuationHistoryPoint[]> {
    const response = await this.http.get<ValuationHistoryPointApiResponse[]>(
      `/api/v1/portfolios/${portfolioId}/valuation-history?period=${period}`
    );
    return response.map(PortfolioMapper.valuationHistoryPointToDomain);
  }

  async getOrders(portfolioId: string): Promise<Order[]> {
    const response = await this.http.get<OrderApiResponse[]>(
      `/api/v1/portfolios/${portfolioId}/orders`
    );
    return response.map((order) => OrderMapper.toDomain(order));
  }

  async getTransactions(portfolioId: string): Promise<Transaction[]> {
    const response = await this.http.get<TransactionApiResponse[]>(
      `/api/v1/portfolios/${portfolioId}/transactions`
    );
    return response.map((transaction) => OrderMapper.transactionToDomain(transaction));
  }

  async search(query: string, investorId?: string, limit = 20): Promise<PortfolioSummary[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    if (investorId) params.set("investor_id", investorId);
    const response = await this.http.get<PortfolioSummaryApiResponse[]>(
      `/api/v1/portfolios/search?${params.toString()}`
    );
    return response.map((r) => ({
      id: r.id,
      name: r.name,
      investorId: r.investor_id,
      currency: r.currency,
    }));
  }

  async list(limit = 50, offset = 0): Promise<Portfolio[]> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const response = await this.http.get<PortfolioApiResponse[]>(
      `/api/v1/portfolios?${params.toString()}`
    );
    return response.map(PortfolioMapper.toDomain);
  }

  async deposit(data: CashOperationDTO): Promise<Portfolio> {
    const response = await this.http.post<PortfolioApiResponse>(
      `/api/v1/portfolios/${data.portfolioId}/deposit`,
      { amount: data.amount }
    );
    return PortfolioMapper.toDomain(response);
  }

  async withdraw(data: CashOperationDTO): Promise<Portfolio> {
    const response = await this.http.post<PortfolioApiResponse>(
      `/api/v1/portfolios/${data.portfolioId}/withdraw`,
      { amount: data.amount }
    );
    return PortfolioMapper.toDomain(response);
  }
}
