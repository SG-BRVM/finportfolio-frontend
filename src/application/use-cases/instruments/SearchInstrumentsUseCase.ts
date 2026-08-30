import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { FinancialInstrument } from "../../../domain/entities/FinancialInstrument";

export class SearchInstrumentsUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(query: string): Promise<FinancialInstrument[]> {
    return this.instrumentRepository.search(query);
  }
}
