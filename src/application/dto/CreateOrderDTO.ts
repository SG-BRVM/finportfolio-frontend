import type { OrderSide } from "../../domain/enums/OrderSide";

export interface CreateOrderDTO {
  portfolioId: string;
  instrumentId: string;
  side: OrderSide;
  quantity: string;
  price: string;
}
