import type { Goal } from "../../domain/entities/Goal";
import type { CreateGoalDTO } from "../dto/CreateGoalDTO";

/**
 * GoalRepository - Port (interface) défini par l'Application.
 * Les Use Cases dépendent UNIQUEMENT de cette abstraction, jamais d'une
 * implémentation HTTP concrète. C'est l'adapter outbound (HttpGoalRepository)
 * qui l'implémente.
 */
export interface GoalRepository {
  create(data: CreateGoalDTO): Promise<Goal>;
  /** Liste paginée, telle que persistée en base (les plus récents d'abord). */
  list(limit?: number, offset?: number): Promise<Goal[]>;
}
