import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { CreateGoalDTO } from "../../../../application/dto/CreateGoalDTO";

const KEY = ["goals", "list"] as const;

/**
 * useGoals - liste paginée des objectifs telle que persistée en base
 * (GET /api/v1/goals). Remplace l'ancien stockage localStorage
 * (goalsStore) qui ne montrait que les objectifs ajoutés depuis ce poste.
 */
export function useGoals(limit = 50, offset = 0) {
  return useQuery({
    queryKey: [...KEY, limit, offset] as const,
    queryFn: () => container.useCases.goals.getAll.execute(limit, offset),
  });
}

export function useAddGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGoalDTO) => container.useCases.goals.create.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}
