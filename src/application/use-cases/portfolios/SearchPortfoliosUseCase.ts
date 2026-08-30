import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { PortfolioSummary } from "../../../domain/entities/PortfolioSummary";

export class SearchPortfoliosUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(query: string, investorId?: string): Promise<PortfolioSummary[]> {
    return this.portfolioRepository.search(query, investorId);
  }
}
