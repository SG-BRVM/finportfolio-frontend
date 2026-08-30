import type { InvestorRepository } from "../../ports/InvestorRepository";
import type { CreateInvestorDTO } from "../../dto/CreateInvestorDTO";
import type { Investor } from "../../../domain/entities/Investor";

/**
 * CreateInvestorUseCase - ne connaît ni Axios, ni React, ni l'URL de l'API.
 * Il dépend uniquement du Port `InvestorRepository`, injecté au constructeur.
 */
export class CreateInvestorUseCase {
  constructor(private readonly investorRepository: InvestorRepository) {}

  async execute(command: CreateInvestorDTO): Promise<Investor> {
    return this.investorRepository.create(command);
  }
}
