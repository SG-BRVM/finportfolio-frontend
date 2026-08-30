import type { Order } from "../../../../domain/entities/Order";
import type { Transaction } from "../../../../domain/entities/Transaction";
import type { OrderSide } from "../../../../domain/enums/OrderSide";
import type { OrderStatus } from "../../../../domain/enums/OrderStatus";
import { Decimal } from "../../../../domain/value-objects/Decimal";
import { Money } from "../../../../domain/value-objects/Money";

/**
 * Forme exacte de la réponse JSON du backend (OrderResponse, snake_case).
 * Le backend ne renvoie pas la devise de l'ordre : elle est implicitement
 * celle du portefeuille, résolue au niveau de la couche UI si besoin
 * d'affichage formaté ; ici on retombe sur une devise neutre.
 */
export interface OrderApiResponse {
  id: string;
  portfolio_id: string;
  instrument_id: string;
  side: OrderSide;
  quantity: string;
  price: string;
  status: OrderStatus;
  created_at: string;
}

/** Forme exacte de la réponse JSON du backend (TransactionResponse, snake_case). */
export interface TransactionApiResponse {
  id: string;
  portfolio_id: string;
  instrument_id: string;
  order_id: string;
  side: OrderSide;
  quantity: string;
  price: string;
  executed_at: string;
}

export class OrderMapper {
  static toDomain(response: OrderApiResponse, currency = "XOF"): Order {
    return {
      id: response.id,
      portfolioId: response.portfolio_id,
      instrumentId: response.instrument_id,
      side: response.side,
      quantity: Decimal.fromString(response.quantity),
      price: Money.of(response.price, currency),
      status: response.status,
      createdAt: new Date(response.created_at),
    };
  }

  static transactionToDomain(response: TransactionApiResponse, currency = "XOF"): Transaction {
    return {
      id: response.id,
      portfolioId: response.portfolio_id,
      instrumentId: response.instrument_id,
      orderId: response.order_id,
      side: response.side,
      quantity: Decimal.fromString(response.quantity),
      price: Money.of(response.price, currency),
      executedAt: new Date(response.executed_at),
    };
  }
}
