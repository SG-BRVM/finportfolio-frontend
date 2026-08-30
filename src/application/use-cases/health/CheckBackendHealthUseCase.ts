import type { HealthRepository, HealthStatus } from "../../ports/HealthRepository";

export class CheckBackendHealthUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  async execute(): Promise<{ health: HealthStatus; ready: HealthStatus }> {
    const [health, ready] = await Promise.all([
      this.healthRepository.checkHealth(),
      this.healthRepository.checkReady(),
    ]);
    return { health, ready };
  }
}
