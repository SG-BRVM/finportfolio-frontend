import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { CreatePortfolioDTO } from "../../dto/CreatePortfolioDTO";
import type { Portfolio } from "../../../domain/entities/Portfolio";

export class CreatePortfolioUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(command: CreatePortfolioDTO): Promise<Portfolio> {
    return this.portfolioRepository.create(command);
  }
}
