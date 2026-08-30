import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Portfolio } from "../../../domain/entities/Portfolio";

export class GetPortfolioUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string): Promise<Portfolio> {
    return this.portfolioRepository.getById(portfolioId);
  }
}
