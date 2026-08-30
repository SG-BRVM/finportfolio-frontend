import { Link } from "react-router-dom";
import { Briefcase, ShieldAlert, ShieldCheck, TriangleAlert, Lightbulb } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { getConsolidatedRiskProfile } from "../../../../mocks/risk";
import { SECTOR_LABELS } from "../../../../domain/enums/Sector";
import { formatPercentage } from "../../../../shared/utils/formatPercentage";
import { ROUTES } from "../../../../shared/constants/routes";

const RISK_TONE = {
  low: "success",
  moderate: "warning",
  high: "destructive",
} as const;

/**
 * RiskPage - "Profil de risque", tous portefeuilles connus confondus.
 *
 * Score/niveau/volatilité/drawdown restent temporairement mockés (voir
 * mocks/risk.ts, aucune notion de risque côté API). La concentration
 * sectorielle et l'exposition actions, elles, sont calculées à partir des
 * vraies positions et du vrai champ FinancialInstrument.sector.
 */
export function RiskPage() {
  const { portfolios, positions, totalValuation, hasAnyPortfolio, isLoading } =
    useConsolidatedPortfolio();

  const riskProfile = getConsolidatedRiskProfile(portfolios.map((p) => p.id));

  let concentration: { sector: string; percentage: number } | null = null;
  let equityExposurePercentage: number | null = null;

  if (!isLoading && totalValuation && !totalValuation.isZero()) {
    const sectorTotals = new Map<string, number>();
    let equityValue = 0;
    const total = totalValuation.amount.toNumber();

    for (const p of positions) {
      if (!p.instrument || !p.marketValue || !p.instrument.sector) continue;
      const value = p.marketValue.amount.toNumber();
      const sector = SECTOR_LABELS[p.instrument.sector];
      sectorTotals.set(sector, (sectorTotals.get(sector) ?? 0) + value);
      if (p.instrument.instrumentType === "STOCK") equityValue += value;
    }

    const top = [...sectorTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) concentration = { sector: top[0], percentage: (top[1] / total) * 100 };
    equityExposurePercentage = (equityValue / total) * 100;
  }

  return (
    <PageContainer
      title="Profil de risque"
      description="Le niveau de risque de votre patrimoine et les indicateurs qui l'expliquent."
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun profil de risque à afficher"
          description="Créez un portefeuille et investissez pour voir votre profil de risque ici."
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-ink-400">
                  Risque global
                </CardTitle>
                {riskProfile.level === "high" ? (
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                ) : (
                  <ShieldCheck
                    className={`h-4 w-4 ${riskProfile.level === "moderate" ? "text-amber-500" : "text-emerald-500"}`}
                  />
                )}
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <p className="font-ledger text-2xl font-semibold text-ink-900">
                    {riskProfile.label.toUpperCase()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-ink-400">Score</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <>
                    <p className="font-ledger text-2xl font-semibold text-ink-900">
                      {riskProfile.score} / 100
                    </p>
                    <Progress value={riskProfile.score} tone={RISK_TONE[riskProfile.level]} className="mt-3" />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Volatilité annualisée"
              value={isLoading ? undefined : formatPercentage(riskProfile.volatility, { forceSign: false, decimals: 1 })}
            />
            <MetricCard
              label="Concentration"
              value={
                isLoading
                  ? undefined
                  : concentration
                    ? formatPercentage(concentration.percentage, { forceSign: false, decimals: 1 })
                    : "—"
              }
              hint={concentration?.sector}
            />
            <MetricCard
              label="Exposition actions"
              value={
                isLoading
                  ? undefined
                  : equityExposurePercentage !== null
                    ? formatPercentage(equityExposurePercentage, { forceSign: false, decimals: 1 })
                    : "—"
              }
            />
            <MetricCard
              label="Drawdown maximal"
              value={isLoading ? undefined : formatPercentage(riskProfile.maxDrawdown, { forceSign: false, decimals: 1 })}
            />
          </div>

          {!isLoading && concentration && concentration.percentage >= 30 && (
            <Alert variant="warning">
              <TriangleAlert />
              <div>
                <AlertTitle>Points d'attention</AlertTitle>
                <AlertDescription>
                  Forte exposition au secteur {concentration.sector.toLowerCase()} (
                  {formatPercentage(concentration.percentage, { forceSign: false, decimals: 1 })} du
                  patrimoine).
                </AlertDescription>
              </div>
            </Alert>
          )}

          {!isLoading && (
            <Alert variant="brand">
              <Lightbulb />
              <div>
                <AlertTitle>Suggestion</AlertTitle>
                <AlertDescription>
                  {concentration && concentration.percentage >= 30
                    ? `Une diversification vers d'autres secteurs que ${concentration.sector.toLowerCase()} pourrait réduire le risque de concentration.`
                    : "Votre patrimoine reste correctement diversifié entre secteurs pour le moment."}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function MetricCard({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs uppercase tracking-wider text-ink-400">{label}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {value === undefined ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="font-ledger text-xl font-semibold text-ink-900">{value}</p>
        )}
        {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      </CardContent>
    </Card>
  );
}
