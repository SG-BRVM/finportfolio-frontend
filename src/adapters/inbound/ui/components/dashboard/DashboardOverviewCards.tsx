import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Wallet, ShieldCheck, ShieldAlert } from "lucide-react";
import type { Money } from "../../../../../domain/value-objects/Money";
import type { PortfolioRiskProfile } from "../../../../../mocks/risk";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import { PERFORMANCE_DIRECTION_CLASSES } from "../../../../../shared/utils/formatPerformance";
import { PerformanceBadge } from "../common/PerformanceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
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
  const isNegative = pnl?.isNegative() ?? false;
  const direction = performancePercentage === null || performancePercentage === 0
    ? "flat"
    : isNegative
      ? "down"
      : "up";

  return (
    <OverviewCardShell
      label="Performance"
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
      <p className="mt-1.5 text-xs text-ink-400">Non réalisée, sur vos positions</p>
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
  return (
    <OverviewCardShell label="Liquidités" icon={Wallet}>
      {isLoading || !cashBalance ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <p className="font-ledger text-xl font-semibold text-ink-900">{cashBalance.format()}</p>
      )}
      <p className="mt-1.5 text-xs text-ink-400">
        {shareOfTotalPercentage === null
          ? "Part du portefeuille non calculable"
          : `${formatPercentage(shareOfTotalPercentage, { forceSign: false, decimals: 1 })} du portefeuille`}
      </p>
    </OverviewCardShell>
  );
}

interface RiskOverviewCardProps {
  riskProfile: PortfolioRiskProfile | null;
  isLoading?: boolean;
}

const RISK_TONE = {
  low: "success",
  moderate: "warning",
  high: "destructive",
} as const;

/**
 * RiskOverviewCard - niveau de risque et score du portefeuille.
 * S'appuie sur un profil temporairement mocké (voir src/mocks/risk.ts) en
 * l'absence d'endpoint de risque côté API.
 */
export function RiskOverviewCard({ riskProfile, isLoading }: RiskOverviewCardProps) {
  return (
    <OverviewCardShell
      label="Risque"
      icon={riskProfile?.level === "high" ? ShieldAlert : ShieldCheck}
      iconClassName={
        riskProfile?.level === "high"
          ? "h-4 w-4 text-rose-500"
          : riskProfile?.level === "moderate"
            ? "h-4 w-4 text-amber-500"
            : "h-4 w-4 text-emerald-500"
      }
    >
      {isLoading || !riskProfile ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <>
          <p className="font-ledger text-xl font-semibold text-ink-900">{riskProfile.label}</p>
          <p className="mt-1.5 text-xs text-ink-400">Score {riskProfile.score} / 100</p>
          <Progress value={riskProfile.score} tone={RISK_TONE[riskProfile.level]} className="mt-3" />
        </>
      )}
    </OverviewCardShell>
  );
}
