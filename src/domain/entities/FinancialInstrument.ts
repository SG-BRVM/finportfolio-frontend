import type { InstrumentType } from "../enums/InstrumentType";
import type { Sector } from "../enums/Sector";
import { Money } from "../value-objects/Money";

/** FinancialInstrument - un instrument financier négociable (action, obligation, ETF, fonds). */
export interface FinancialInstrument {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly instrumentType: InstrumentType;
  readonly currency: string;
  readonly currentPrice: Money;
  /** Valeur nominale (face value) - distincte du prix de marché, ne
   * change que sur opération sur titres (division, regroupement). */
  readonly nominalValue: Money | null;
  /** Secteur d'activité de l'émetteur - `null`/absent si inconnu. */
  readonly sector?: Sector | null;
  /** Date de création de la fiche instrument. */
  readonly createdAt: Date;
  /** Date de la dernière modification (prix ou valeur nominale). */
  readonly updatedAt: Date;
}
