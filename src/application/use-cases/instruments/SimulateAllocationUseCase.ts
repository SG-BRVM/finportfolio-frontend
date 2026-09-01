import type { InstrumentRepository } from "../../ports/InstrumentRepository";
import type { AllocationSimulationResult } from "../../../domain/entities/AllocationSimulation";
import type { SimulateAllocationDTO } from "../../dto/SimulateAllocationDTO";

export class SimulateAllocationUseCase {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(data: SimulateAllocationDTO): Promise<AllocationSimulationResult> {
    return this.instrumentRepository.simulateAllocation(data);
  }
}
