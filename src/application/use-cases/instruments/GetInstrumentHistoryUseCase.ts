import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { InstrumentHistoryEntry } from "../../../domain/entities/InstrumentHistoryEntry";

export class GetInstrumentHistoryUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(instrumentId: string): Promise<InstrumentHistoryEntry[]> {
    return this.instrumentRepository.getHistory(instrumentId);
  }
}
