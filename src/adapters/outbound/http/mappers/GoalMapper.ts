import type { Goal } from "../../../../domain/entities/Goal";

/** Forme exacte de la réponse JSON du backend (GoalResponse, snake_case). */
export interface GoalApiResponse {
  id: string;
  name: string;
  target_amount: string;
  current_amount: string;
  currency: string;
  created_at: string;
}

/**
 * GoalMapper - traduit la réponse HTTP brute (snake_case) en entité
 * de Domain (camelCase). Seul endroit de l'application où cette
 * différence de convention est gérée. Les montants sont renvoyés en
 * chaîne par le backend (Decimal) ; ils sont convertis en number ici
 * pour l'affichage (barres de progression, formatage).
 */
export class GoalMapper {
  static toDomain(response: GoalApiResponse): Goal {
    return {
      id: response.id,
      name: response.name,
      targetAmount: Number(response.target_amount),
      currentAmount: Number(response.current_amount),
      currency: response.currency,
      createdAt: new Date(response.created_at),
    };
  }
}
