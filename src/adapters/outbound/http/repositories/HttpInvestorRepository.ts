import type { InvestorRepository } from "../../../../application/ports/InvestorRepository";
import type { CreateInvestorDTO } from "../../../../application/dto/CreateInvestorDTO";
import type { Investor } from "../../../../domain/entities/Investor";
import type { InvestorSummary } from "../../../../domain/entities/InvestorSummary";
import type { HttpClient } from "../axios/HttpClient";
import { InvestorMapper, type InvestorApiResponse } from "../mappers/InvestorMapper";

/** Forme exacte de la réponse JSON du backend pour l'autocomplétion. */
interface InvestorSummaryApiResponse {
  id: string;
  name: string;
}

/**
 * HttpInvestorRepository - implémentation HTTP du Port InvestorRepository.
 * Responsabilités : appeler l'API, récupérer la réponse REST, la
 * transformer via le Mapper, et retourner un objet du Domain.
 */
export class HttpInvestorRepository implements InvestorRepository {
  constructor(private readonly http: HttpClient) {}

  async create(data: CreateInvestorDTO): Promise<Investor> {
    const response = await this.http.post<InvestorApiResponse>("/api/v1/investors", {
      name: data.name,
      email: data.email,
    });
    return InvestorMapper.toDomain(response);
  }

  async getById(id: string): Promise<Investor> {
    const response = await this.http.get<InvestorApiResponse>(`/api/v1/investors/${id}`);
    return InvestorMapper.toDomain(response);
  }

  async search(query: string, limit = 20): Promise<InvestorSummary[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    const response = await this.http.get<InvestorSummaryApiResponse[]>(
      `/api/v1/investors/search?${params.toString()}`
    );
    return response.map((r) => ({ id: r.id, name: r.name }));
  }

  async list(limit = 50, offset = 0): Promise<Investor[]> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const response = await this.http.get<InvestorApiResponse[]>(
      `/api/v1/investors?${params.toString()}`
    );
    return response.map(InvestorMapper.toDomain);
  }
}
