import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { UpdateNominalValueDTO } from "../../dto/UpdateNominalValueDTO";
import type { FinancialInstrument } from "../../../domain/entities/FinancialInstrument";

export class UpdateNominalValueUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(command: UpdateNominalValueDTO): Promise<FinancialInstrument> {
    return this.instrumentRepository.updateNominalValue(command);
  }
}
