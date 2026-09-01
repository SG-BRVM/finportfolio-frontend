import type { AllocationWeightingStrategy } from "../../domain/entities/AllocationSimulation";

export interface SimulateAllocationDTO {
  /** Montant du capital à simuler, en chaîne décimale (jamais un `number`). */
  capital: string;
  currency: string;
  strategy: AllocationWeightingStrategy;
  instrumentIds: string[];
  /** Poids personnalisés (uniquement utilisés si strategy === "CUSTOM").
   * N'importe quelle échelle positive : le backend les normalise, ils
   * n'ont pas besoin de sommer à 100. */
  customWeights?: Record<string, string>;
}
