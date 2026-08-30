import type { Investor } from "../../domain/entities/Investor";
import type { InvestorSummary } from "../../domain/entities/InvestorSummary";
import type { CreateInvestorDTO } from "../dto/CreateInvestorDTO";

/**
 * InvestorRepository - Port (interface) défini par l'Application.
 * Les Use Cases dépendent UNIQUEMENT de cette abstraction, jamais d'une
 * implémentation HTTP concrète. C'est l'adapter outbound (Http*Repository)
 * qui l'implémente.
 */
export interface InvestorRepository {
  create(data: CreateInvestorDTO): Promise<Investor>;
  getById(id: string): Promise<Investor>;
  /** Autocomplétion : recherche bornée par nom/email, jamais une liste complète. */
  search(query: string, limit?: number): Promise<InvestorSummary[]>;
  /** Liste paginée, telle que persistée en base (les plus récents d'abord). */
  list(limit?: number, offset?: number): Promise<Investor[]>;
}
