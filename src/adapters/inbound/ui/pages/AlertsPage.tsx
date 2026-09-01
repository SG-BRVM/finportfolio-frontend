import { Bell, ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../components/layout/PageContainer";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { OrderSideBadge } from "../components/common/StatusBadge";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useOrderAlerts, useOrderAlertTitle, type OrderAlert } from "../hooks/useOrderAlerts";
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
  const { t } = useTranslation();
  const { alerts, isLoading } = useOrderAlerts();
  const orderAlertTitle = useOrderAlertTitle();

  return (
    <PageContainer title={t("alerts.title")} description={t("alerts.description")}>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState icon={Bell} title={t("alerts.empty")} description={t("alerts.emptyDescription")} />
      ) : (
        <div className="space-y-3">
          {alerts.map(({ order, portfolioName, instrumentSymbol }: OrderAlert) => (
            <Alert key={order.id} variant={STATUS_ALERT_VARIANT[order.status]}>
              <ArrowLeftRight />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTitle>{orderAlertTitle[order.status]}</AlertTitle>
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
