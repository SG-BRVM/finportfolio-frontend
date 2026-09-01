import { Link } from "react-router-dom";
import { Briefcase, PieChart, TrendingUp, Wallet } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { useSectorLabels } from "../components/common/useSectorLabels";
import { useTranslation } from "react-i18next";
import { toRatioPercentage } from "../../../../shared/utils/computeRatio";
import { formatPercentage } from "../../../../shared/utils/formatPercentage";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * AdvicePage - "Conseils pour votre portefeuille". Le texte de chaque
 * conseil est généré à partir de vraies données agrégées (performance,
 * part de liquidités, concentration sectorielle sur le vrai champ
 * FinancialInstrument.sector) plutôt qu'un texte marketing générique.
 */
export function AdvicePage() {
  const { t } = useTranslation();
  const sectorLabels = useSectorLabels();
  const {
    positions,
    totalValue,
    totalValuation,
    totalCash,
    performancePercentage,
    hasAnyPortfolio,
    isLoading,
  } = useConsolidatedPortfolio();

  let concentration: { sector: string; percentage: number } | null = null;
  if (!isLoading && totalValuation && !totalValuation.isZero()) {
    const sectorTotals = new Map<string, number>();
    const total = totalValuation.amount.toNumber();
    for (const p of positions) {
      if (!p.instrument || !p.marketValue || !p.instrument.sector) continue;
      const sector = sectorLabels[p.instrument.sector];
      const value = p.marketValue.amount.toNumber();
      sectorTotals.set(sector, (sectorTotals.get(sector) ?? 0) + value);
    }
    const top = [...sectorTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) concentration = { sector: top[0], percentage: (top[1] / total) * 100 };
  }

  const liquidityPercentage =
    totalCash && totalValue ? toRatioPercentage(totalCash, totalValue) : null;

  return (
    <PageContainer
      title={t("advice.pageTitle")}
      description={t("advice.pageDescription")}
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title={t("advice.emptyTitle")}
          description={t("advice.emptyDescription")}
          action={
            <Link
              to={ROUTES.portfolios}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t("orders.viewMyPortfolios")}
            </Link>
          }
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <AdviceCard
            icon={PieChart}
            title={t("advice.diversification")}
            badge={concentration && concentration.percentage >= 30 ? t("advice.toWatch") : t("advice.correct")}
            badgeTone={concentration && concentration.percentage >= 30 ? "warning" : "success"}
            description={
              concentration
                ? t("advice.diversificationDescription", {
                    percentage: formatPercentage(concentration.percentage, { forceSign: false, decimals: 1 }),
                    sector: concentration.sector.toLowerCase(),
                  })
                : t("advice.diversificationEmptyDescription")
            }
          />
          <AdviceCard
            icon={TrendingUp}
            title={t("nav.performance")}
            badge={
              performancePercentage === null
                ? "-"
                : formatPercentage(performancePercentage, { decimals: 2 })
            }
            badgeTone={
              performancePercentage === null ? "neutral" : performancePercentage >= 0 ? "success" : "destructive"
            }
            description={
              performancePercentage === null
                ? t("advice.performanceEmptyDescription")
                : t("advice.performanceDescription", {
                    direction: performancePercentage >= 0 ? t("advice.progressing") : t("advice.declining"),
                    percentage: formatPercentage(Math.abs(performancePercentage), { forceSign: false, decimals: 2 }),
                  })
            }
          />
          <AdviceCard
            icon={Wallet}
            title={t("dashboard.liquidity")}
            badge={
              liquidityPercentage === null
                ? "-"
                : formatPercentage(liquidityPercentage, { forceSign: false, decimals: 1 })
            }
            badgeTone="neutral"
            description={
              liquidityPercentage === null
                ? t("advice.liquidityEmptyDescription")
                : t("advice.liquidityDescription", {
                    percentage: formatPercentage(liquidityPercentage, { forceSign: false, decimals: 1 }),
                  })
            }
          />
        </div>
      )}
    </PageContainer>
  );
}

interface AdviceCardProps {
  icon: typeof PieChart;
  title: string;
  badge: string;
  badgeTone: "success" | "warning" | "destructive" | "neutral";
  description: string;
}

function AdviceCard({ icon: Icon, title, badge, badgeTone, description }: AdviceCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-brand-600" />
          {title}
        </CardTitle>
        <Badge variant={badgeTone}>{badge}</Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-ink-600">{description}</p>
      </CardContent>
    </Card>
  );
}
