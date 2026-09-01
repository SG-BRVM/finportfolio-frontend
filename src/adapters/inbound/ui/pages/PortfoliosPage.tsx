import { useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PortfolioForm } from "../components/portfolios/PortfolioForm";
import { PortfolioCard } from "../components/portfolios/PortfolioCard";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { usePortfolios } from "../hooks/usePortfolios";
import { ROUTES } from "../../../../shared/constants/routes";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * PortfoliosPage - "Mes portefeuilles".
 *
 * Le paramètre d'URL `investorId` (positionné par exemple depuis "Nouveau
 * portefeuille" sur la fiche d'un investisseur) pré-remplit le
 * formulaire de création pour ce client, sans imposer de créer le
 * portefeuille pour cet investisseur précis.
 */
export function PortfoliosPage() {
  const { t } = useTranslation();
  const { portfolios, isLoading } = usePortfolios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultInvestorId = searchParams.get("investorId") ?? undefined;

  return (
    <PageContainer
      title={t("nav.portfolios")}
      description={t("portfolios.pageDescription")}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PortfolioForm
            defaultInvestorId={defaultInvestorId}
            onCreated={(id) => navigate(ROUTES.portfolioDetails(id))}
          />
        </div>
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <LoadingState />
          ) : portfolios.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={t("portfolios.emptyTitle")}
              description={t("portfolios.emptyDescription")}
            />
          ) : (
            portfolios.map((portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} />)
          )}
        </div>
      </div>
    </PageContainer>
  );
}
