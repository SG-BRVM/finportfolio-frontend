import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../components/layout/PageContainer";
import { CreateOrderDialog } from "../components/orders/CreateOrderDialog";
import { ConsolidatedOrdersTable } from "../components/orders/ConsolidatedOrdersTable";
import { TransactionsTable } from "../components/orders/TransactionsTable";
import { EmptyState } from "../components/common/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useConsolidatedOrders, useConsolidatedTransactions } from "../hooks/useOrdersOverview";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * OrdersPage - "Ordres & transactions".
 *
 * Deux onglets partagés par les routes /orders et /transactions (voir
 * navigation.ts) : ORDRES agrège les ordres de tous les portefeuilles
 * persistés en base (voir useConsolidatedOrders), TRANSACTIONS agrège de
 * la même façon leur historique d'exécution (voir
 * useConsolidatedTransactions). L'onglet actif suit l'URL pour que les
 * deux entrées de navigation gardent un sens.
 */
export function OrdersPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, isLoading: areOrdersLoading, hasAnyPortfolio } = useConsolidatedOrders();
  const { transactions, isLoading: areTransactionsLoading } = useConsolidatedTransactions();

  const activeTab = location.pathname === ROUTES.transactions ? "transactions" : "orders";

  return (
    <PageContainer
      title={t("orders.pageTitle")}
      description={t("orders.pageDescription")}
      actions={<CreateOrderDialog />}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          navigate(value === "transactions" ? ROUTES.transactions : ROUTES.orders)
        }
      >
        <TabsList>
          <TabsTrigger value="orders">{t("nav.orders")} ({orders.length})</TabsTrigger>
          <TabsTrigger value="transactions">{t("nav.transactions")} ({transactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {!areOrdersLoading && !hasAnyPortfolio ? (
            <EmptyState
              icon={Briefcase}
              title={t("portfolios.emptyTitle")}
              description={t("orders.emptyPortfolioDescription")}
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
            <ConsolidatedOrdersTable orders={orders} isLoading={areOrdersLoading} />
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTable transactions={transactions} isLoading={areTransactionsLoading} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
