import type { Position } from "../entities/Position";
import type { FinancialInstrument } from "../entities/FinancialInstrument";
import { Money } from "../value-objects/Money";

/**
 * ProfitLossService - calcule le profit ou perte latent(e) (unrealized P&L)
 * d'un portefeuille : (prix courant - prix moyen d'achat) × quantité,
 * sommé sur toutes les positions.
 *
 * Pur domaine, testable sans backend, sans React, sans HTTP.
 */
export class ProfitLossService {
  static calculate(
    positions: readonly Position[],
    instruments: ReadonlyMap<string, FinancialInstrument>,
    currency: string
  ): Money {
    return positions.reduce<Money>((total, position) => {
      const instrument = instruments.get(position.instrumentId);
      if (!instrument) return total;

      const currentValue = instrument.currentPrice.multiply(position.quantity);
      const costBasis = Money.of(position.averagePrice, instrument.currency).multiply(
        position.quantity
      );
      return total.add(currentValue.subtract(costBasis));
    }, Money.zero(currency));
  }
}
