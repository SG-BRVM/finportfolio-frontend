import type { OrderRepository } from "../../../../application/ports/OrderRepository";
import type { CreateOrderDTO } from "../../../../application/dto/CreateOrderDTO";
import type { Order } from "../../../../domain/entities/Order";
import type { Transaction } from "../../../../domain/entities/Transaction";
import type { HttpClient } from "../axios/HttpClient";
import { OrderMapper, type OrderApiResponse, type TransactionApiResponse } from "../mappers/OrderMapper";

export class HttpOrderRepository implements OrderRepository {
  constructor(private readonly http: HttpClient) {}

  async create(data: CreateOrderDTO): Promise<Order> {
    const response = await this.http.post<OrderApiResponse>("/api/v1/orders", {
      portfolio_id: data.portfolioId,
      instrument_id: data.instrumentId,
      side: data.side,
      quantity: data.quantity,
      price: data.price,
    });
    return OrderMapper.toDomain(response);
  }

  async getById(id: string): Promise<Order> {
    const response = await this.http.get<OrderApiResponse>(`/api/v1/orders/${id}`);
    return OrderMapper.toDomain(response);
  }

  async execute(id: string): Promise<Transaction> {
    const response = await this.http.post<TransactionApiResponse>(
      `/api/v1/orders/${id}/execute`
    );
    return OrderMapper.transactionToDomain(response);
  }

  async cancel(id: string): Promise<Order> {
    const response = await this.http.post<OrderApiResponse>(`/api/v1/orders/${id}/cancel`);
    return OrderMapper.toDomain(response);
  }
}
