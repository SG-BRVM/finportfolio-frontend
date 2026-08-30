import type { InstrumentType } from "../../domain/enums/InstrumentType";
import type { Sector } from "../../domain/enums/Sector";

export interface CreateInstrumentDTO {
  symbol: string;
  name: string;
  instrumentType: InstrumentType;
  currency: string;
  currentPrice: string;
  /** Optionnelle : valeur nominale à l'émission. */
  nominalValue?: string;
  /** Optionnel : secteur d'activité de l'émetteur. */
  sector?: Sector;
}
