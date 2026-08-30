import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Portfolio } from "../../../domain/entities/Portfolio";

/**
 * GetPortfoliosUseCase - liste paginée des portefeuilles persistés en base.
 * Remplace l'ancien registre localStorage (`useKnownPortfolios`) qui ne
 * reflétait que les portefeuilles vus depuis ce poste.
 */
export class GetPortfoliosUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(limit?: number, offset?: number): Promise<Portfolio[]> {
    return this.portfolioRepository.list(limit, offset);
  }
}
