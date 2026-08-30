import type { OrderSide } from "../enums/OrderSide";
import type { OrderStatus } from "../enums/OrderStatus";
import { Decimal } from "../value-objects/Decimal";
import { Money } from "../value-objects/Money";

/** Order - un ordre d'achat ou de vente d'un instrument dans un portefeuille. */
export interface Order {
  readonly id: string;
  readonly portfolioId: string;
  readonly instrumentId: string;
  readonly side: OrderSide;
  readonly quantity: Decimal;
  readonly price: Money;
  readonly status: OrderStatus;
  readonly createdAt: Date;
}
