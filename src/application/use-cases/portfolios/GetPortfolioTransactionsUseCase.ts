import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Transaction } from "../../../domain/entities/Transaction";

/**
 * GetPortfolioTransactionsUseCase - historique des exécutions persisté en
 * base pour un portefeuille. Remplace l'ancien `sessionTransactionLog`
 * (localStorage) qui ne connaissait que les fills reçus pendant la
 * session de navigation en cours.
 */
export class GetPortfolioTransactionsUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string): Promise<Transaction[]> {
    return this.portfolioRepository.getTransactions(portfolioId);
  }
}
