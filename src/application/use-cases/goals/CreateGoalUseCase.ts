import type { GoalRepository } from "../../ports/GoalRepository";
import type { CreateGoalDTO } from "../../dto/CreateGoalDTO";
import type { Goal } from "../../../domain/entities/Goal";

/**
 * CreateGoalUseCase - ne connaît ni Axios, ni React, ni l'URL de l'API.
 * Il dépend uniquement du Port `GoalRepository`, injecté au constructeur.
 */
export class CreateGoalUseCase {
  constructor(private readonly goalRepository: GoalRepository) {}

  async execute(command: CreateGoalDTO): Promise<Goal> {
    return this.goalRepository.create(command);
  }
}
