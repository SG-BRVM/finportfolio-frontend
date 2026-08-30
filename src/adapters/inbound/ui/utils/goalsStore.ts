import { DEFAULT_GOALS, type Goal } from "../../../../mocks/goals";

/**
 * goalsStore - aucune entité "objectif" n'existe côté backend (voir
 * mocks/goals.ts). En attendant un vrai endpoint, les objectifs vivent
 * uniquement dans localStorage : la démonstration démarre avec
 * `DEFAULT_GOALS`, et tout objectif ajouté via "Ajouter un objectif" y
 * est mémorisé, sur le même principe que pour d'autres besoins de
 * stockage purement UI dans l'application.
 */
const STORAGE_KEY = "finportfolio:goals";

export interface CreateGoalInput {
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
}

export function listGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GOALS;
    return JSON.parse(raw) as Goal[];
  } catch {
    return DEFAULT_GOALS;
  }
}

export function addGoal(input: CreateGoalInput): Goal {
  const goal: Goal = {
    id: `goal-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    name: input.name,
    targetAmount: input.targetAmount,
    currentAmount: input.currentAmount,
    currency: input.currency,
  };
  const existing = listGoals();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, goal]));
  return goal;
}
