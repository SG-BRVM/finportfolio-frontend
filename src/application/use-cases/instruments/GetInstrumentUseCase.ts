import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { FinancialInstrument } from "../../../domain/entities/FinancialInstrument";

export class GetInstrumentUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(instrumentId: string): Promise<FinancialInstrument> {
    return this.instrumentRepository.getById(instrumentId);
  }
}
