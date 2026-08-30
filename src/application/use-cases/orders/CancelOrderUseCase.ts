import type { OrderRepository } from "../../ports/OrderRepository";
import type { Order } from "../../../domain/entities/Order";

export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    return this.orderRepository.cancel(orderId);
  }
}
