import type { GoalRepository } from "../../ports/GoalRepository";
import type { Goal } from "../../../domain/entities/Goal";

/**
 * GetGoalsUseCase - liste paginée des objectifs persistés en base.
 * Remplace l'ancien stockage localStorage (`goalsStore`) qui ne
 * reflétait que les objectifs vus depuis ce poste.
 */
export class GetGoalsUseCase {
  constructor(private readonly goalRepository: GoalRepository) {}

  async execute(limit?: number, offset?: number): Promise<Goal[]> {
    return this.goalRepository.list(limit, offset);
  }
}
