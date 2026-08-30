import type { OrderRepository } from "../../ports/OrderRepository";
import type { Transaction } from "../../../domain/entities/Transaction";

export class ExecuteOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Transaction> {
    return this.orderRepository.execute(orderId);
  }
}
