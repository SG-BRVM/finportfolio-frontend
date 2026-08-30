import type { OrderRepository } from "../../ports/OrderRepository";
import type { Order } from "../../../domain/entities/Order";

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    return this.orderRepository.getById(orderId);
  }
}
