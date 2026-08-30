import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PerformanceChart } from "../components/performance/PerformanceChart";
import { PerformanceSummary } from "../components/performance/PerformanceSummary";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { usePerformanceHistory } from "../hooks/usePerformanceHistory";
import type { PerformancePeriod } from "../../../../domain/entities/PerformanceHistory";
import { ROUTES } from "../../../../shared/constants/routes";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * PerformancePage - évolution de la valeur totale du patrimoine (tous
 * portefeuilles confondus) et indicateurs de performance associés. La
 * courbe et les indicateurs sont tous dérivés de données réelles : la
 * courbe est reconstituée côté backend à partir des transactions
 * exécutées et de l'historique de prix des instruments (voir
 * GET /portfolios/{id}/valuation-history), les indicateurs (valeur
 * actuelle, performance, gain/perte, performance annualisée) des vraies
 * valorisations agrégées.
 */
export function PerformancePage() {
  const [period, setPeriod] = useState<PerformancePeriod>("1A");
  const { totalValue, totalPnl, performancePercentage, earliestPortfolioDate, hasAnyPortfolio, isLoading } =
    useConsolidatedPortfolio();
  const { points, isLoading: isHistoryLoading } = usePerformanceHistory(period);

  const currency = totalValue?.currency.toString() ?? "XOF";

  const annualizedPercentage = useMemo(() => {
    if (performancePercentage === null || !earliestPortfolioDate) return null;
    const elapsedDays = (Date.now() - earliestPortfolioDate.getTime()) / MILLISECONDS_PER_DAY;
    if (elapsedDays < 1) return null;
    const base = 1 + performancePercentage / 100;
    if (base <= 0) return null;
    return (Math.pow(base, 365 / elapsedDays) - 1) * 100;
  }, [performancePercentage, earliestPortfolioDate]);

  return (
    <PageContainer
      title="Performance"
      description="L'évolution détaillée de la valeur de votre portefeuille."
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title="Aucune performance à afficher"
          description="Créez un portefeuille pour suivre l'évolution de sa valeur ici."
          action={
            <Link
              to={ROUTES.portfolios}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Voir mes portefeuilles
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <PerformanceSummary
            totalValue={totalValue}
            totalPnl={totalPnl}
            performancePercentage={performancePercentage}
            annualizedPercentage={annualizedPercentage}
            isLoading={isLoading}
          />

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Performance du portefeuille</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart
                points={points}
                currency={currency}
                period={period}
                onPeriodChange={setPeriod}
                isLoading={isLoading || isHistoryLoading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
