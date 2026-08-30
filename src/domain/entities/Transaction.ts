import type { OrderSide } from "../enums/OrderSide";
import { Decimal } from "../value-objects/Decimal";
import { Money } from "../value-objects/Money";

/** Transaction - l'exécution effective (fill) d'un Order, horodatée. */
export interface Transaction {
  readonly id: string;
  readonly portfolioId: string;
  readonly instrumentId: string;
  readonly orderId: string;
  readonly side: OrderSide;
  readonly quantity: Decimal;
  readonly price: Money;
  readonly executedAt: Date;
}
