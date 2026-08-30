import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { CashOperationDTO } from "../../dto/CashOperationDTO";
import type { Portfolio } from "../../../domain/entities/Portfolio";

export class DepositCapitalUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(command: CashOperationDTO): Promise<Portfolio> {
    return this.portfolioRepository.deposit(command);
  }
}
