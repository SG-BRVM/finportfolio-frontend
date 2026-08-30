import type { Order } from "../../domain/entities/Order";
import type { Transaction } from "../../domain/entities/Transaction";
import type { CreateOrderDTO } from "../dto/CreateOrderDTO";

export interface OrderRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  getById(id: string): Promise<Order>;
  /** Exécute l'ordre : le backend retourne la Transaction résultante (le fill), pas l'Order. */
  execute(id: string): Promise<Transaction>;
  cancel(id: string): Promise<Order>;
}
