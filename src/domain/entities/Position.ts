import { Decimal } from "../value-objects/Decimal";

/** Position - la quantité détenue d'un instrument dans un portefeuille, à prix moyen d'acquisition. */
export interface Position {
  readonly portfolioId: string;
  readonly instrumentId: string;
  readonly quantity: Decimal;
  readonly averagePrice: Decimal;
}
