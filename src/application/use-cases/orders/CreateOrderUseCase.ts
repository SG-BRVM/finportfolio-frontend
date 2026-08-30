import type { OrderRepository } from "../../ports/OrderRepository";
import type { CreateOrderDTO } from "../../dto/CreateOrderDTO";
import type { Order } from "../../../domain/entities/Order";

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CreateOrderDTO): Promise<Order> {
    return this.orderRepository.create(command);
  }
}
