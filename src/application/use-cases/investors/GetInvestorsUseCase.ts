import type { InvestorRepository } from "../../ports/InvestorRepository";
import type { Investor } from "../../../domain/entities/Investor";

/**
 * GetInvestorsUseCase - liste paginée des investisseurs persistés en base.
 * Remplace l'ancien registre localStorage (`useKnownInvestors`) qui ne
 * reflétait que les investisseurs vus depuis ce poste.
 */
export class GetInvestorsUseCase {
  constructor(private readonly investorRepository: InvestorRepository) {}

  async execute(limit?: number, offset?: number): Promise<Investor[]> {
    return this.investorRepository.list(limit, offset);
  }
}
