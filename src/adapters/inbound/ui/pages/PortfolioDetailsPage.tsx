import { useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PortfolioSummary } from "../components/portfolios/PortfolioSummary";
import { PortfolioPositionsTable } from "../components/portfolios/PortfolioPositionsTable";
import { PortfolioOrdersTable } from "../components/portfolios/PortfolioOrdersTable";
import { PortfolioValuationCard } from "../components/dashboard/PortfolioValuationCard";
import { PnlCard } from "../components/dashboard/PnlCard";
import { CreateOrderForm } from "../components/orders/CreateOrderForm";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { usePortfolio, usePortfolioPositions, usePortfolioOrders } from "../hooks/usePortfolios";
import { useInstruments } from "../hooks/useInstruments";
import { getErrorMessage } from "../utils/errorMessage";
import { useTranslation } from "react-i18next";

export function PortfolioDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: portfolio, isLoading, isError, error, refetch } = usePortfolio(id);
  const { data: positions = [] } = usePortfolioPositions(id);
  const { data: orders = [] } = usePortfolioOrders(id);
  const { data: instruments = [] } = useInstruments();

  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));

  return (
    <PageContainer title={t("portfolios.detailTitle")} description={id}>
      {isLoading && <LoadingState />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {portfolio && (
        <div className="space-y-8">
          <PortfolioSummary portfolio={portfolio} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PortfolioValuationCard portfolioId={portfolio.id} />
            <PnlCard portfolioId={portfolio.id} />
          </div>

          <Tabs defaultValue="positions">
            <TabsList>
              <TabsTrigger value="positions">{t("investments.positionsLabel")} ({positions.length})</TabsTrigger>
              <TabsTrigger value="orders">{t("nav.orders")} ({orders.length})</TabsTrigger>
              <TabsTrigger value="new-order">{t("orders.newOrder")}</TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <PortfolioPositionsTable positions={positions} instruments={instrumentsById} />
            </TabsContent>

            <TabsContent value="orders">
              <PortfolioOrdersTable orders={orders} />
            </TabsContent>

            <TabsContent value="new-order">
              <div className="max-w-xl">
                <CreateOrderForm defaultPortfolioId={portfolio.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageContainer>
  );
}
