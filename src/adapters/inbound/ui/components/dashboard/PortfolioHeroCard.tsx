import { Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Money } from "../../../../../domain/value-objects/Money";
import { PerformanceBadge } from "../common/PerformanceBadge";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface PortfolioHeroCardProps {
  portfolioName: string;
  /** Valeur totale = valorisation des positions + liquidités. */
  totalValue: Money | null;
  /** Performance non réalisée sur les positions (%), `null` si non calculable. */
  performancePercentage: number | null;
  isLoading?: boolean;
}

/**
 * PortfolioHeroCard - résumé patrimonial en tête du Dashboard. Met en
 * avant la valeur totale du portefeuille sélectionné (positions +
 * liquidités) et sa performance non réalisée, avant le détail par carte
 * (Performance / Liquidités / Risque) juste en dessous.
 */
export function PortfolioHeroCard({
  portfolioName,
  totalValue,
  performancePercentage,
  isLoading,
}: PortfolioHeroCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden bg-brand-950">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-brand-200">
            <Landmark className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {t("dashboard.totalWealth")} - {portfolioName}
            </span>
          </div>

          {isLoading || !totalValue ? (
            <Skeleton className="mt-3 h-10 w-56 bg-white/10" />
          ) : (
            <p className="mt-2 font-ledger text-3xl font-semibold text-white sm:text-4xl">
              {totalValue.format()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-6 w-24 bg-white/10" />
          ) : (
            <PerformanceBadge value={performancePercentage} />
          )}
          <span className="text-sm text-brand-200">{t("dashboard.unrealizedPerformanceOnPositions")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
