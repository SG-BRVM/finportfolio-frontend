import type { InvestorRepository } from "../../ports/InvestorRepository";
import type { Investor } from "../../../domain/entities/Investor";

export class GetInvestorUseCase {
  constructor(private readonly investorRepository: InvestorRepository) {}

  async execute(investorId: string): Promise<Investor> {
    return this.investorRepository.getById(investorId);
  }
}
