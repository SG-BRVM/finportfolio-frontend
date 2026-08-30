import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { CreateInstrumentDTO } from "../../dto/CreateInstrumentDTO";
import type { FinancialInstrument } from "../../../domain/entities/FinancialInstrument";

export class CreateInstrumentUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(command: CreateInstrumentDTO): Promise<FinancialInstrument> {
    return this.instrumentRepository.create(command);
  }
}
