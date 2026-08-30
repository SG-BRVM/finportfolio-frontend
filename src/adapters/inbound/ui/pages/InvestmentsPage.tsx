import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { InvestmentTable } from "../components/investments/InvestmentTable";
import { EmptyState } from "../components/common/EmptyState";
import { useConsolidatedPortfolio } from "../hooks/useConsolidatedPortfolio";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * InvestmentsPage - vue consolidée de toutes les positions détenues,
 * tous portefeuilles confondus (voir useConsolidatedPortfolio), plutôt
 * que le détail d'un seul portefeuille à la fois comme sur le Dashboard.
 */
export function InvestmentsPage() {
  const { positions, hasAnyPortfolio, isLoading } = useConsolidatedPortfolio();

  return (
    <PageContainer
      title="Mes investissements"
      description="La vue consolidée de vos positions, tous portefeuilles confondus."
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun investissement"
          description="Créez un portefeuille et passez un ordre pour voir vos investissements apparaître ici."
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
        <InvestmentTable positions={positions} isLoading={isLoading} />
      )}
    </PageContainer>
  );
}
