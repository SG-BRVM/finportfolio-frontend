import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { FinancialInstrument } from "../../../domain/entities/FinancialInstrument";

export class GetInstrumentsUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(): Promise<FinancialInstrument[]> {
    return this.instrumentRepository.getAll();
  }
}
