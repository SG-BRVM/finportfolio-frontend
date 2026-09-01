import type { InstrumentType } from "../enums/InstrumentType";
import { Money } from "../value-objects/Money";

/** Stratégie de pondération pour une simulation d'allocation de capital. */
export type AllocationWeightingStrategy = "EQUAL" | "CUSTOM";

/** Une ligne de résultat de simulation : combien d'unités d'un instrument
 * la stratégie achète, et pour quel montant - tout est calculé côté
 * backend, le front n'affiche que ce qu'il reçoit. */
export interface AllocationSimulationLine {
  readonly instrumentId: string;
  readonly symbol: string;
  readonly name: string;
  readonly instrumentType: InstrumentType;
  readonly currentPrice: Money;
  /** Poids ciblé par la stratégie, en pourcentage (ex. 33.33). */
  readonly targetWeightPercent: number;
  /** Nombre d'unités entières à acheter pour respecter ce poids. */
  readonly quantity: number;
  /** Montant réellement investi sur cet instrument (prix x quantité). */
  readonly investedAmount: Money;
  /** Poids réellement obtenu une fois les quantités arrondies à l'entier
   * inférieur, en pourcentage du montant total investi. */
  readonly actualWeightPercent: number;
}

export interface AllocationSimulationResult {
  readonly currency: string;
  readonly capital: Money;
  readonly investedAmount: Money;
  /** Capital non investi car les quantités sont arrondies à l'entier. */
  readonly cashRemaining: Money;
  readonly investedPercent: number;
  readonly lines: AllocationSimulationLine[];
}
