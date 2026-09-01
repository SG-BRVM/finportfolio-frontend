import type { FinancialInstrument } from "../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../domain/entities/InstrumentHistoryEntry";
import type { AllocationSimulationResult } from "../../domain/entities/AllocationSimulation";
import type { CreateInstrumentDTO } from "../dto/CreateInstrumentDTO";
import type { UpdateNominalValueDTO } from "../dto/UpdateNominalValueDTO";
import type { SimulateAllocationDTO } from "../dto/SimulateAllocationDTO";

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
  /** Simule l'achat d'un panier d'instruments selon une stratégie de
   * pondération pour un capital donné - tout le calcul (quantités,
   * valorisation, poids réel) est fait côté backend. */
  simulateAllocation(data: SimulateAllocationDTO): Promise<AllocationSimulationResult>;
}
