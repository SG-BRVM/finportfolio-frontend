import type { Portfolio } from "../../domain/entities/Portfolio";
import type { PortfolioSummary } from "../../domain/entities/PortfolioSummary";
import type { Position } from "../../domain/entities/Position";
import type { Order } from "../../domain/entities/Order";
import type { Transaction } from "../../domain/entities/Transaction";
import type { ValuationHistoryPoint } from "../../domain/entities/PerformanceHistory";
import type { PerformancePeriod } from "../../domain/entities/PerformanceHistory";
import type { Money } from "../../domain/value-objects/Money";
import type { CreatePortfolioDTO } from "../dto/CreatePortfolioDTO";
import type { CashOperationDTO } from "../dto/CashOperationDTO";

export interface PortfolioRepository {
  create(data: CreatePortfolioDTO): Promise<Portfolio>;
  getById(id: string): Promise<Portfolio>;
  getPositions(portfolioId: string): Promise<Position[]>;
  getValuation(portfolioId: string): Promise<Money>;
  /** Courbe de valorisation reconstituée sur la période demandée (rejeu des
   * transactions + de l'historique de prix des instruments côté backend). */
  getValuationHistory(portfolioId: string, period: PerformancePeriod): Promise<ValuationHistoryPoint[]>;
  getPnl(portfolioId: string): Promise<Money>;
  getOrders(portfolioId: string): Promise<Order[]>;
  /** Historique des exécutions (fills) de ce portefeuille, tel que persisté en base. */
  getTransactions(portfolioId: string): Promise<Transaction[]>;
  /** Autocomplétion : recherche bornée par nom, optionnellement scopée à un investisseur. */
  search(query: string, investorId?: string, limit?: number): Promise<PortfolioSummary[]>;
  /** Liste paginée, telle que persistée en base (les plus récents d'abord). */
  list(limit?: number, offset?: number): Promise<Portfolio[]>;
  /** Crédite du capital dans le portefeuille - seule façon légitime d'obtenir du pouvoir d'achat. */
  deposit(data: CashOperationDTO): Promise<Portfolio>;
  /** Débite du capital du portefeuille. Échoue si le solde est insuffisant. */
  withdraw(data: CashOperationDTO): Promise<Portfolio>;
}
