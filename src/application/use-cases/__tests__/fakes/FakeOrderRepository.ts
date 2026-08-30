import type { OrderRepository } from "../../../ports/OrderRepository";
import type { CreateOrderDTO } from "../../../dto/CreateOrderDTO";
import type { Order } from "../../../../domain/entities/Order";
import type { Transaction } from "../../../../domain/entities/Transaction";
import { Decimal } from "../../../../domain/value-objects/Decimal";
import { Money } from "../../../../domain/value-objects/Money";

/** FakeOrderRepository - implémente le Port en mémoire, sans HTTP ni backend réel. */
export class FakeOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  async create(data: CreateOrderDTO): Promise<Order> {
    const order: Order = {
      id: `order-${this.orders.size + 1}`,
      portfolioId: data.portfolioId,
      instrumentId: data.instrumentId,
      side: data.side,
      quantity: Decimal.fromString(data.quantity),
      price: Money.of(data.price, "MAD"),
      status: "PENDING",
      createdAt: new Date("2026-01-01T00:00:00Z"),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getById(id: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error(`Order introuvable : ${id}`);
    return order;
  }

  async execute(id: string): Promise<Transaction> {
    const order = await this.getById(id);
    this.orders.set(id, { ...order, status: "EXECUTED" });
    return {
      id: `txn-${id}`,
      portfolioId: order.portfolioId,
      instrumentId: order.instrumentId,
      orderId: order.id,
      side: order.side,
      quantity: order.quantity,
      price: order.price,
      executedAt: new Date("2026-01-01T00:05:00Z"),
    };
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.getById(id);
    const cancelled: Order = { ...order, status: "CANCELLED" };
    this.orders.set(id, cancelled);
    return cancelled;
  }
}
