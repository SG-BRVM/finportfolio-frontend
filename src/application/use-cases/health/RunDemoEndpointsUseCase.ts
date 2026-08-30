import type { HealthRepository, DemoResult } from "../../ports/HealthRepository";

export class RunDemoEndpointsUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  async executeFast(): Promise<DemoResult> {
    return this.healthRepository.callFastEndpoint();
  }

  async executeSlow(): Promise<DemoResult> {
    return this.healthRepository.callSlowEndpoint();
  }
}
