import { CalendarClock, ChartNoAxesCombined, Wallet2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Money } from "../../../../../domain/value-objects/Money";
import { PERFORMANCE_DIRECTION_CLASSES, formatPerformance } from "../../../../../shared/utils/formatPerformance";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PerformanceBadge } from "../common/PerformanceBadge";
import { Skeleton } from "../ui/skeleton";

interface PerformanceSummaryProps {
  totalValue: Money | null;
  totalPnl: Money | null;
  performancePercentage: number | null;
  /** Performance annualisée (%), calculée à partir de la date du portefeuille le plus ancien. `null` si non calculable (moins d'un jour d'historique). */
  annualizedPercentage: number | null;
  isLoading?: boolean;
}

function SummaryCard({
  label,
  icon: Icon,
  isLoading,
  children,
}: {
  label: string;
  icon: typeof Wallet2;
  isLoading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs uppercase tracking-wider text-ink-400 dark:text-ink-500">{label}</CardTitle>
        <Icon className="h-4 w-4 text-ink-300 dark:text-ink-600" />
      </CardHeader>
      <CardContent className="pt-0">{isLoading ? <Skeleton className="h-8 w-28" /> : children}</CardContent>
    </Card>
  );
}

/**
 * PerformanceSummary - quatre indicateurs clés de la page Performance.
 * Valeur actuelle, performance et gain/perte proviennent des vraies
 * valorisations agrégées (voir useConsolidatedPortfolio) ; la
 * performance annualisée est dérivée de ces mêmes chiffres réels et de
 * l'ancienneté du portefeuille le plus ancien.
 */
export function PerformanceSummary({
  totalValue,
  totalPnl,
  performancePercentage,
  annualizedPercentage,
  isLoading,
}: PerformanceSummaryProps) {
  const { t } = useTranslation();
  const direction = performancePercentage === null || performancePercentage === 0
    ? "flat"
    : (totalPnl?.isNegative() ?? false)
      ? "down"
      : "up";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label={t("performance.currentValue")} icon={Wallet2} isLoading={isLoading}>
        <p className="font-ledger text-xl font-semibold text-ink-900 dark:text-ink-50">{totalValue?.format() ?? "-"}</p>
      </SummaryCard>

      <SummaryCard label={t("nav.performance")} icon={ChartNoAxesCombined} isLoading={isLoading}>
        <PerformanceBadge value={performancePercentage} />
      </SummaryCard>

      <SummaryCard label={t("performance.gainLoss")} icon={Wallet2} isLoading={isLoading}>
        <p className={`font-ledger text-xl font-semibold ${PERFORMANCE_DIRECTION_CLASSES[direction]}`}>
          {totalPnl?.format() ?? "-"}
        </p>
      </SummaryCard>

      <SummaryCard label={t("performance.annualizedPerformance")} icon={CalendarClock} isLoading={isLoading}>
        {annualizedPercentage === null ? (
          <p className="text-sm text-ink-400 dark:text-ink-500">{t("performance.notComputable")}</p>
        ) : (
          <p className={`font-ledger text-xl font-semibold ${PERFORMANCE_DIRECTION_CLASSES[formatPerformance(annualizedPercentage).direction]}`}>
            {formatPerformance(annualizedPercentage).label}
          </p>
        )}
      </SummaryCard>
    </div>
  );
}
