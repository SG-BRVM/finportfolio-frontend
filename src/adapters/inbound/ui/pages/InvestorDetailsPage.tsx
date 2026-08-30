import { Link, useParams } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { InvestorDetails } from "../components/investors/InvestorDetails";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { Button } from "../components/ui/button";
import { useInvestor } from "../hooks/useInvestors";
import { getErrorMessage } from "../utils/errorMessage";
import { ROUTES } from "../../../../shared/constants/routes";

export function InvestorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: investor, isLoading, isError, error, refetch } = useInvestor(id);

  return (
    <PageContainer
      title={investor ? investor.name : "Détail investisseur"}
      description="Coordonnées du client et accès à ses portefeuilles."
      actions={
        investor && (
          <Button asChild variant="outline">
            <Link to={`${ROUTES.portfolios}?investorId=${investor.id}`}>
              <BriefcaseBusiness className="h-4 w-4" />
              Nouveau portefeuille
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
