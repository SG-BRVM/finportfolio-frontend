import type { PortfolioRepository } from "../../ports/PortfolioRepository";
import type { Order } from "../../../domain/entities/Order";

export class GetPortfolioOrdersUseCase {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async execute(portfolioId: string): Promise<Order[]> {
    return this.portfolioRepository.getOrders(portfolioId);
  }
}
