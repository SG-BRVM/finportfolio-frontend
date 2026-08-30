import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { ValuationHistoryPoint, PerformancePeriod } from "../../../domain/entities/PerformanceHistory";

export class GetPortfolioValuationHistoryUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string, period: PerformancePeriod): Promise<ValuationHistoryPoint[]> {
    return this.portfolioRepository.getValuationHistory(portfolioId, period);
  }
}
