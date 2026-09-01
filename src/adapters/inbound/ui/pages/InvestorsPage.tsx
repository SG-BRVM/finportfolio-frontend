import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { InvestorForm } from "../components/investors/InvestorForm";
import { InvestorCard } from "../components/investors/InvestorCard";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { useInvestors } from "../hooks/useInvestors";
import { ROUTES } from "../../../../shared/constants/routes";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * InvestorsPage - "Investisseurs" (clients de la plateforme).
 *
 * La liste affichée vient de GET /api/v1/investors : elle reflète ce qui
 * est réellement persisté en base, quel que soit le poste depuis lequel
 * l'investisseur a été créé.
 */
export function InvestorsPage() {
  const { t } = useTranslation();
  const { data: investors = [], isLoading } = useInvestors();
  const navigate = useNavigate();

  return (
    <PageContainer
      title={t("nav.investors")}
      description={t("investors.pageDescription")}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <InvestorForm onCreated={(id) => navigate(ROUTES.investorDetails(id))} />
        </div>
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <LoadingState />
          ) : investors.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("investors.emptyTitle")}
              description={t("investors.emptyDescription")}
            />
          ) : (
            investors.map((investor) => <InvestorCard key={investor.id} investor={investor} />)
          )}
        </div>
      </div>
    </PageContainer>
  );
}
