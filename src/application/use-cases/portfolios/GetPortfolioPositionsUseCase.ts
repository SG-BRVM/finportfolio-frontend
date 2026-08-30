import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Position } from "../../../domain/entities/Position";

export class GetPortfolioPositionsUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string): Promise<Position[]> {
    return this.portfolioRepository.getPositions(portfolioId);
  }
}
