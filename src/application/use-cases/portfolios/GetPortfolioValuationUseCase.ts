import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Money } from "../../../domain/value-objects/Money";

export class GetPortfolioValuationUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string): Promise<Money> {
    return this.portfolioRepository.getValuation(portfolioId);
  }
}
