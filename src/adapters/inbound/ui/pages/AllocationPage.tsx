import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { AllocationChart } from "../components/allocation/AllocationChart";
import { SectorExposure } from "../components/allocation/SectorExposure";
import { AllocationSimulator } from "../components/allocation/AllocationSimulator";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * AllocationPage - répartition du patrimoine par classe d'actifs et par
 * secteur d'activité, toutes deux calculées à partir des vraies positions
 * (le secteur vient du champ FinancialInstrument.sector, aucune donnée
 * mockée).
 */
export function AllocationPage() {
  const { t } = useTranslation();
  const { positions, hasAnyPortfolio, isLoading } = useConsolidatedPortfolio();

  return (
    <PageContainer
      title={t("nav.allocation")}
      description={t("allocation.pageDescription")}
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title={t("allocation.emptyTitle")}
          description={t("allocation.emptyPortfolioDescription")}
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>{t("allocation.portfolioAllocation")}</CardTitle>
              <CardDescription>{t("allocation.byAssetClass")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationChart positions={positions} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>{t("allocation.sectorExposureTitle")}</CardTitle>
              <CardDescription>{t("allocation.bySector")}</CardDescription>
            </CardHeader>
            <CardContent>
              <SectorExposure positions={positions} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mt-6">
        <CardHeader className="pb-0">
          <CardTitle>{t("allocation.simulatorTitle")}</CardTitle>
          <CardDescription>{t("allocation.simulatorDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AllocationSimulator />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
