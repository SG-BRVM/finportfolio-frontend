import type { GoalRepository } from "../../../../application/ports/GoalRepository";
import type { CreateGoalDTO } from "../../../../application/dto/CreateGoalDTO";
import type { Goal } from "../../../../domain/entities/Goal";
import type { HttpClient } from "../axios/HttpClient";
import { GoalMapper, type GoalApiResponse } from "../mappers/GoalMapper";

/**
 * HttpGoalRepository - implémentation HTTP du Port GoalRepository.
 * Responsabilités : appeler l'API, récupérer la réponse REST, la
 * transformer via le Mapper, et retourner un objet du Domain.
 */
export class HttpGoalRepository implements GoalRepository {
  constructor(private readonly http: HttpClient) {}

  async create(data: CreateGoalDTO): Promise<Goal> {
    const response = await this.http.post<GoalApiResponse>("/api/v1/goals", {
      name: data.name,
      target_amount: data.targetAmount,
      current_amount: data.currentAmount,
      currency: data.currency,
    });
    return GoalMapper.toDomain(response);
  }

  async list(limit = 50, offset = 0): Promise<Goal[]> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const response = await this.http.get<GoalApiResponse[]>(
      `/api/v1/goals?${params.toString()}`
    );
    return response.map(GoalMapper.toDomain);
  }
}
