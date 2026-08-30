/** Portfolio - un portefeuille d'investissement appartenant à un Investor. */
import type { Money } from "../value-objects/Money";

export interface Portfolio {
  readonly id: string;
  readonly investorId: string;
  readonly name: string;
  readonly currency: string;
  readonly cashBalance: Money;
  readonly createdAt: Date;
}
