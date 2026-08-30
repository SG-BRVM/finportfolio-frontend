import type { InvestorRepository } from "../../../ports/InvestorRepository";
import type { CreateInvestorDTO } from "../../../dto/CreateInvestorDTO";
import type { Investor } from "../../../../domain/entities/Investor";
import type { InvestorSummary } from "../../../../domain/entities/InvestorSummary";

/** FakeInvestorRepository - implémente le Port en mémoire, sans HTTP ni backend réel. */
export class FakeInvestorRepository implements InvestorRepository {
  public readonly created: CreateInvestorDTO[] = [];
  private investors = new Map<string, Investor>();

  async create(data: CreateInvestorDTO): Promise<Investor> {
    this.created.push(data);
    const investor: Investor = {
      id: `investor-${this.investors.size + 1}`,
      name: data.name,
      email: data.email,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    };
    this.investors.set(investor.id, investor);
    return investor;
  }

  async getById(id: string): Promise<Investor> {
    const investor = this.investors.get(id);
    if (!investor) throw new Error(`Investor introuvable : ${id}`);
    return investor;
  }

  async search(_query: string, _limit?: number): Promise<InvestorSummary[]> {
    return [...this.investors.values()].map((i) => ({
      id: i.id,
      name: i.name,
    }));
  }

  async list(limit = 50, offset = 0): Promise<Investor[]> {
    return [...this.investors.values()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
}
