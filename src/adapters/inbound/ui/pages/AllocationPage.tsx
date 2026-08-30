import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { AllocationChart } from "../components/allocation/AllocationChart";
import { SectorExposure } from "../components/allocation/SectorExposure";
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
  const { positions, hasAnyPortfolio, isLoading } = useConsolidatedPortfolio();

  return (
    <PageContainer
      title="Allocation"
      description="La répartition de votre portefeuille par classe d'actifs et par secteur."
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title="Aucune allocation à afficher"
          description="Créez un portefeuille et investissez pour voir son allocation ici."
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Allocation du portefeuille</CardTitle>
              <CardDescription>Répartition par classe d'actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationChart positions={positions} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Exposition sectorielle</CardTitle>
              <CardDescription>Répartition par secteur d'activité</CardDescription>
            </CardHeader>
            <CardContent>
              <SectorExposure positions={positions} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
