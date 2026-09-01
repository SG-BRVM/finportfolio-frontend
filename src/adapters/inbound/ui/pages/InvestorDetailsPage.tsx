import { Link, useParams } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../components/layout/PageContainer";
import { InvestorDetails } from "../components/investors/InvestorDetails";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { Button } from "../components/ui/button";
import { useInvestor } from "../hooks/useInvestors";
import { getErrorMessage } from "../utils/errorMessage";
import { ROUTES } from "../../../../shared/constants/routes";

export function InvestorDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: investor, isLoading, isError, error, refetch } = useInvestor(id);

  return (
    <PageContainer
      title={investor ? investor.name : t("investors.detailTitle")}
      description={t("investors.detailDescription")}
      actions={
        investor && (
          <Button asChild variant="outline">
            <Link to={`${ROUTES.portfolios}?investorId=${investor.id}`}>
              <BriefcaseBusiness className="h-4 w-4" />
              {t("portfolios.newPortfolio")}
            </Link>
          </Button>
        )
      }
    >
      {isLoading && <LoadingState />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {investor && <InvestorDetails investor={investor} />}
    </PageContainer>
  );
}
