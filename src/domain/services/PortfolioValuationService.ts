import type { Position } from "../entities/Position";
import type { FinancialInstrument } from "../entities/FinancialInstrument";
import { Money } from "../value-objects/Money";
import { Decimal } from "../value-objects/Decimal";

/**
 * PortfolioValuationService - calcule la valorisation totale d'un
 * portefeuille à partir de ses positions et des prix courants des
 * instruments détenus.
 *
 * Pur domaine : aucune dépendance à React, Axios ou au backend. La
 * valorisation "officielle" reste calculée côté serveur
 * (GET /portfolios/{id}/valuation) ; ce service permet de la
 * recalculer/vérifier côté client ou de l'afficher en mode dégradé.
 */
export class PortfolioValuationService {
  static calculate(
    positions: readonly Position[],
    instruments: ReadonlyMap<string, FinancialInstrument>,
    currency: string
  ): Money {
    return positions.reduce<Money>((total, position) => {
      const instrument = instruments.get(position.instrumentId);
      if (!instrument) {
        // Un instrument inconnu ne doit pas faire planter la valorisation :
        // il est simplement ignoré (sa valeur ne peut être déterminée).
        return total;
      }
      const positionValue = instrument.currentPrice.multiply(position.quantity);
      return total.add(positionValue);
    }, Money.zero(currency));
  }

  static totalQuantity(positions: readonly Position[]): Decimal {
    return positions.reduce<Decimal>((sum, p) => sum.add(p.quantity), Decimal.zero());
  }
}
