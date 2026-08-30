import type { FinancialInstrument } from "../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../domain/entities/InstrumentHistoryEntry";
import type { CreateInstrumentDTO } from "../dto/CreateInstrumentDTO";
import type { UpdateNominalValueDTO } from "../dto/UpdateNominalValueDTO";

export interface InstrumentRepository {
  create(data: CreateInstrumentDTO): Promise<FinancialInstrument>;
  getById(id: string): Promise<FinancialInstrument>;
  getAll(): Promise<FinancialInstrument[]>;
  /** Autocomplétion : recherche bornée par symbole/nom. */
  search(query: string, limit?: number): Promise<FinancialInstrument[]>;
  /** Change la valeur nominale (opération sur titres : division, regroupement). */
  updateNominalValue(data: UpdateNominalValueDTO): Promise<FinancialInstrument>;
  /** Historique complet des modifications (création, cours, valeur nominale). */
  getHistory(instrumentId: string): Promise<InstrumentHistoryEntry[]>;
}
