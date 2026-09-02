import { Link } from "react-router-dom";
import { Briefcase, TriangleAlert, Lightbulb } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardDescription } from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { useSectorLabels } from "../components/common/useSectorLabels";
import { useTranslation } from "react-i18next";
import { formatPercentage } from "../../../../shared/utils/formatPercentage";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * RiskPage - "Profil de risque", tous portefeuilles connus confondus.
 *
 * N'affiche que ce qui est réellement calculable à partir du backend :
 * concentration sectorielle et exposition actions, dérivées des vraies
 * positions et du vrai champ FinancialInstrument.sector. Il n'existe
 * aucune notion de score de risque, de niveau global, de volatilité ni
 * de drawdown dans le Domain backend actuel (voir app/domain côté
 * finportfolio) : ces indicateurs, auparavant mockés (mocks/risk.ts,
 * supprimé), ont été retirés plutôt que remplacés faute de donnée réelle.
 */
export function RiskPage() {
  const { t } = useTranslation();
  const sectorLabels = useSectorLabels();
  const { positions, totalValuation, hasAnyPortfolio, isLoading } = useConsolidatedPortfolio();

  let concentration: { sector: string; percentage: number } | null = null;
  let equityExposurePercentage: number | null = null;

  if (!isLoading && totalValuation && !totalValuation.isZero()) {
    const sectorTotals = new Map<string, number>();
    let equityValue = 0;
    const total = totalValuation.amount.toNumber();

    for (const p of positions) {
      if (!p.instrument || !p.marketValue || !p.instrument.sector) continue;
      const value = p.marketValue.amount.toNumber();
      const sector = sectorLabels[p.instrument.sector];
      sectorTotals.set(sector, (sectorTotals.get(sector) ?? 0) + value);
      if (p.instrument.instrumentType === "STOCK") equityValue += value;
    }

    const top = [...sectorTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) concentration = { sector: top[0], percentage: (top[1] / total) * 100 };
    equityExposurePercentage = (equityValue / total) * 100;
  }

  return (
    <PageContainer
      title={t("risk.pageTitle")}
      description={t("risk.pageDescription")}
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title={t("risk.emptyTitle")}
          description={t("risk.emptyDescription")}
          action={
            <Link
              to={ROUTES.portfolios}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t("orders.viewMyPortfolios")}
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MetricCard
              label={t("risk.concentration")}
              value={
                isLoading
                  ? undefined
                  : concentration
                    ? formatPercentage(concentration.percentage, { forceSign: false, decimals: 1 })
                    : "-"
              }
              hint={concentration?.sector}
            />
            <MetricCard
              label={t("risk.equityExposure")}
              value={
                isLoading
                  ? undefined
                  : equityExposurePercentage !== null
                    ? formatPercentage(equityExposurePercentage, { forceSign: false, decimals: 1 })
                    : "-"
              }
            />
          </div>

          {!isLoading && concentration && concentration.percentage >= 30 && (
            <Alert variant="warning">
              <TriangleAlert />
              <div>
                <AlertTitle>{t("risk.attentionPoints")}</AlertTitle>
                <AlertDescription>
                  {t("risk.highExposure", {
                    sector: concentration.sector.toLowerCase(),
                    percentage: formatPercentage(concentration.percentage, { forceSign: false, decimals: 1 }),
                  })}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {!isLoading && (
            <Alert variant="brand">
              <Lightbulb />
              <div>
                <AlertTitle>{t("risk.suggestion")}</AlertTitle>
                <AlertDescription>
                  {concentration && concentration.percentage >= 30
                    ? t("risk.diversificationSuggestion", { sector: concentration.sector.toLowerCase() })
                    : t("risk.wellDiversified")}
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
          <p className="font-ledger text-xl font-semibold text-ink-900 dark:text-ink-50">{value}</p>
        )}
        {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      </CardContent>
    </Card>
  );
}

