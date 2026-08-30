// TEMPORARY MOCK DATA
// Il n'existe aucune notion d'objectif financier côté API (pas
// d'entité Goal dans le Domain backend actuel - voir app/domain côté
// finportfolio). Remplacer par le use case + le port applicatifs
// adéquats (ex. CreateGoalUseCase / GetGoalsUseCase) lorsque l'API
// exposera cette donnée.
//
// Isolé ici (src/mocks/) pour la définition/le jeu de démonstration ;
// la persistance des objectifs ajoutés par l'utilisateur (localStorage,
// le temps de la session) vit dans utils/goalsStore.ts.

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
}

export const DEFAULT_GOALS: Goal[] = [
  {
    id: "goal-immobilier",
    name: "Objectif immobilier",
    targetAmount: 30_000_000,
    currentAmount: 14_400_000,
    currency: "XOF",
  },
  {
    id: "goal-retraite",
    name: "Retraite",
    targetAmount: 40_000_000,
    currentAmount: 20_000_000,
    currency: "XOF",
  },
];
