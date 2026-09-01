import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { positions, hasAnyPortfolio, isLoading } = useConsolidatedPortfolio();

  return (
    <PageContainer
      title={t("nav.investments")}
      description={t("investments.pageDescription")}
    >
      {!isLoading && !hasAnyPortfolio ? (
        <EmptyState
          icon={Briefcase}
          title={t("investments.emptyTitle")}
          description={t("investments.emptyPortfolioDescription")}
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
        <InvestmentTable positions={positions} isLoading={isLoading} />
      )}
    </PageContainer>
  );
}
