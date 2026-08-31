import { Bell, ArrowLeftRight } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { OrderSideBadge } from "../components/common/StatusBadge";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useOrderAlerts, ORDER_ALERT_TITLE, type OrderAlert } from "../hooks/useOrderAlerts";
import { formatQuantity } from "../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../shared/utils/formatDate";
import type { OrderStatus } from "../../../../domain/enums/OrderStatus";

const STATUS_ALERT_VARIANT: Record<OrderStatus, "default" | "warning"> = {
  EXECUTED: "default",
  PENDING: "warning",
  CANCELLED: "default",
};

/**
 * AlertsPage - "Alertes". Auparavant catégorisées (performance, risque,
 * ordres, marchés, sécurité) via mocks/notifications.ts ; le backend n'a
 * de contrepartie réelle que pour les ordres (voir useOrderAlerts), les
 * autres catégories ont été retirées faute de données réelles plutôt que
 * laissées mockées.
 */
export function AlertsPage() {
  const { alerts, isLoading } = useOrderAlerts();

  return (
    <PageContainer title="Alertes" description="Les derniers ordres passés sur vos portefeuilles.">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState icon={Bell} title="Aucune alerte" description="Aucun ordre n'a encore été passé." />
      ) : (
        <div className="space-y-3">
          {alerts.map(({ order, portfolioName, instrumentSymbol }: OrderAlert) => (
            <Alert key={order.id} variant={STATUS_ALERT_VARIANT[order.status]}>
              <ArrowLeftRight />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTitle>{ORDER_ALERT_TITLE[order.status]}</AlertTitle>
                  <OrderSideBadge side={order.side} />
                  <span className="ml-auto text-xs text-ink-400">{formatDate(order.createdAt)}</span>
                </div>
                <AlertDescription>
                  {formatQuantity(order.quantity)} {instrumentSymbol} - {portfolioName} -{" "}
                  {order.price.format()}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
