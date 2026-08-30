import type { InvestorRepository } from "../../ports/InvestorRepository";
import type { InvestorSummary } from "../../../domain/entities/InvestorSummary";

export class SearchInvestorsUseCase {
  constructor(private readonly investorRepository: InvestorRepository) {}

  async execute(query: string): Promise<InvestorSummary[]> {
    return this.investorRepository.search(query);
  }
}
