import type { Portfolio } from "../../../../domain/entities/Portfolio";
import { toRatioPercentage } from "../../../../shared/utils/computeRatio";
import { usePortfolioValuation, usePortfolioPnl } from "./usePortfolios";

/**
 * usePortfolioOverview - agrège les chiffres du Dashboard pour un
 * portefeuille : valeur totale (positions + liquidités), performance non
 * réalisée sur les positions, part des liquidités dans le total.
 *
 * Composé à partir des hooks existants (`usePortfolioValuation`,
 * `usePortfolioPnl`) - aucun nouvel appel réseau, aucun nouvel
 * endpoint : uniquement de la dérivation d'affichage, tenue hors des
 * composants UI (voir shared/utils/computeRatio).
 *
 * Rappel de sémantique backend : la "valorisation" ne couvre que les
 * positions (voir PortfolioValuationService) ; les liquidités
 * (`portfolio.cashBalance`) en sont distinctes et doivent être ajoutées
 * pour obtenir la valeur totale du portefeuille.
 */
export function usePortfolioOverview(portfolio: Portfolio | undefined) {
  const { data: valuation, isLoading: isValuationLoading } = usePortfolioValuation(portfolio?.id);
  const { data: pnl, isLoading: isPnlLoading } = usePortfolioPnl(portfolio?.id);

  const isLoading = isValuationLoading || isPnlLoading;

  if (!portfolio || !valuation || !pnl) {
    return { totalValue: undefined, pnl: undefined, cashBalance: undefined, performancePercentage: null, liquidityPercentage: null, isLoading };
  }

  const costBasis = valuation.subtract(pnl);
  const totalValue = valuation.add(portfolio.cashBalance);

  return {
    totalValue,
    pnl,
    cashBalance: portfolio.cashBalance,
    performancePercentage: toRatioPercentage(pnl, costBasis),
    liquidityPercentage: toRatioPercentage(portfolio.cashBalance, totalValue),
    isLoading,
  };
}
