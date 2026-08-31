import { Link } from "react-router-dom";
import { Briefcase, TriangleAlert, Lightbulb } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardDescription } from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { SECTOR_LABELS } from "../../../../domain/enums/Sector";
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
      description="Concentration sectorielle et exposition de votre patrimoine."
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

