import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { Money } from "../../../../../domain/value-objects/Money";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import { PERFORMANCE_DIRECTION_CLASSES } from "../../../../../shared/utils/formatPerformance";
import { PerformanceBadge } from "../common/PerformanceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface OverviewCardShellProps {
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
}

/** Coquille commune aux trois cartes (label, icône, contenu) pour une mise en page cohérente. */
function OverviewCardShell({ label, icon: Icon, iconClassName, children }: OverviewCardShellProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs uppercase tracking-wider text-ink-400">{label}</CardTitle>
        <Icon className={iconClassName ?? "h-4 w-4 text-ink-300"} />
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

interface PerformanceOverviewCardProps {
  pnl: Money | null;
  performancePercentage: number | null;
  isLoading?: boolean;
}

/** PerformanceOverviewCard - gain/perte latent(e) sur les positions, en montant et en pourcentage. */
export function PerformanceOverviewCard({
  pnl,
  performancePercentage,
  isLoading,
}: PerformanceOverviewCardProps) {
  const { t } = useTranslation();
  const isNegative = pnl?.isNegative() ?? false;
  const direction = performancePercentage === null || performancePercentage === 0
    ? "flat"
    : isNegative
      ? "down"
      : "up";

  return (
    <OverviewCardShell
      label={t("nav.performance")}
      icon={isNegative ? TrendingDown : TrendingUp}
      iconClassName={`h-4 w-4 ${PERFORMANCE_DIRECTION_CLASSES[direction]}`}
    >
      {isLoading || !pnl ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <div className="flex items-baseline gap-2">
          <PerformanceBadge value={performancePercentage} />
          <span className={`font-ledger text-sm font-medium ${PERFORMANCE_DIRECTION_CLASSES[direction]}`}>
            {pnl.format()}
          </span>
        </div>
      )}
      <p className="mt-1.5 text-xs text-ink-400">{t("dashboard.unrealizedOnPositions")}</p>
    </OverviewCardShell>
  );
}

interface LiquidityOverviewCardProps {
  cashBalance: Money | null;
  shareOfTotalPercentage: number | null;
  isLoading?: boolean;
}

/** LiquidityOverviewCard - trésorerie disponible et sa part dans le portefeuille total. */
export function LiquidityOverviewCard({
  cashBalance,
  shareOfTotalPercentage,
  isLoading,
}: LiquidityOverviewCardProps) {
  const { t } = useTranslation();
  return (
    <OverviewCardShell label={t("dashboard.liquidity")} icon={Wallet}>
      {isLoading || !cashBalance ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <p className="font-ledger text-xl font-semibold text-ink-900">{cashBalance.format()}</p>
      )}
      <p className="mt-1.5 text-xs text-ink-400">
        {shareOfTotalPercentage === null
          ? t("dashboard.shareNotComputable")
          : t("dashboard.shareOfPortfolio", {
              percentage: formatPercentage(shareOfTotalPercentage, { forceSign: false, decimals: 1 }),
            })}
      </p>
    </OverviewCardShell>
  );
}
