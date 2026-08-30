import type { FinancialInstrument } from "../../../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../../../domain/entities/InstrumentHistoryEntry";
import type { InstrumentType } from "../../../../domain/enums/InstrumentType";
import type { Sector } from "../../../../domain/enums/Sector";
import { Money } from "../../../../domain/value-objects/Money";

/** Forme exacte de la réponse JSON du backend (InstrumentResponse, snake_case). */
export interface InstrumentApiResponse {
  id: string;
  symbol: string;
  name: string;
  instrument_type: InstrumentType;
  currency: string;
  current_price: string;
  nominal_value: string | null;
  sector?: Sector | null;
  created_at: string;
  updated_at: string;
}

/** Forme exacte d'une entrée d'historique renvoyée par le backend. */
export interface InstrumentHistoryEntryApiResponse {
  id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
  source: string;
}

export class InstrumentMapper {
  static toDomain(response: InstrumentApiResponse): FinancialInstrument {
    return {
      id: response.id,
      symbol: response.symbol,
      name: response.name,
      instrumentType: response.instrument_type,
      currency: response.currency,
      currentPrice: Money.of(response.current_price, response.currency),
      nominalValue:
        response.nominal_value !== null
          ? Money.of(response.nominal_value, response.currency)
          : null,
      sector: response.sector,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    };
  }

  static historyToDomain(
    response: InstrumentHistoryEntryApiResponse
  ): InstrumentHistoryEntry {
    return {
      id: response.id,
      field: response.field as InstrumentHistoryEntry["field"],
      oldValue: response.old_value,
      newValue: response.new_value,
      changedAt: new Date(response.changed_at),
      source: response.source as InstrumentHistoryEntry["source"],
    };
  }
}
