import type { Investor } from "../../../../domain/entities/Investor";

/** Forme exacte de la réponse JSON du backend (InvestorResponse, snake_case). */
export interface InvestorApiResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

/**
 * InvestorMapper - traduit la réponse HTTP brute (snake_case) en entité
 * de Domain (camelCase). Seul endroit de l'application où cette
 * différence de convention est gérée.
 */
export class InvestorMapper {
  static toDomain(response: InvestorApiResponse): Investor {
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      createdAt: new Date(response.created_at),
    };
  }
}
