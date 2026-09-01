import type { FinancialInstrument } from "../../../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../../../domain/entities/InstrumentHistoryEntry";
import type {
  AllocationSimulationLine,
  AllocationSimulationResult,
} from "../../../../domain/entities/AllocationSimulation";
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

/** Forme exacte d'une ligne de simulation d'allocation renvoyée par le backend. */
export interface AllocationSimulationLineApiResponse {
  instrument_id: string;
  symbol: string;
  name: string;
  instrument_type: InstrumentType;
  current_price: string;
  target_weight_percent: string;
  quantity: number;
  invested_amount: string;
  actual_weight_percent: string;
}

/** Forme exacte de la réponse JSON du backend pour la simulation d'allocation. */
export interface AllocationSimulationApiResponse {
  currency: string;
  capital: string;
  invested_amount: string;
  cash_remaining: string;
  invested_percent: string;
  lines: AllocationSimulationLineApiResponse[];
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

  static allocationLineToDomain(
    response: AllocationSimulationLineApiResponse,
    currency: string
  ): AllocationSimulationLine {
    return {
      instrumentId: response.instrument_id,
      symbol: response.symbol,
      name: response.name,
      instrumentType: response.instrument_type,
      currentPrice: Money.of(response.current_price, currency),
      targetWeightPercent: Number(response.target_weight_percent),
      quantity: response.quantity,
      investedAmount: Money.of(response.invested_amount, currency),
      actualWeightPercent: Number(response.actual_weight_percent),
    };
  }

  static allocationResultToDomain(
    response: AllocationSimulationApiResponse
  ): AllocationSimulationResult {
    const { currency } = response;
    return {
      currency,
      capital: Money.of(response.capital, currency),
      investedAmount: Money.of(response.invested_amount, currency),
      cashRemaining: Money.of(response.cash_remaining, currency),
      investedPercent: Number(response.invested_percent),
      lines: response.lines.map((line) =>
        InstrumentMapper.allocationLineToDomain(line, currency)
      ),
    };
  }
}
