import type { Order } from "../../../../../domain/entities/Order";
import { OrderSideBadge, OrderStatusBadge } from "../common/StatusBadge";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { EmptyState } from "../common/EmptyState";
import { OrderActions } from "../orders/OrderActions";
import { ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PortfolioOrdersTable({ orders }: { orders: Order[] }) {
  const { t } = useTranslation();
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title={t("portfolios.orders.emptyTitle")}
        description={t("portfolios.orders.emptyDescription")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400 dark:text-ink-500">
          <tr>
            <th className="px-4 py-3 font-medium">{t("orders.form.side")}</th>
            <th className="px-4 py-3 font-medium">{t("investments.quantity")}</th>
            <th className="px-4 py-3 font-medium">{t("orders.price")}</th>
            <th className="px-4 py-3 font-medium">{t("common.status")}</th>
            <th className="px-4 py-3 font-medium">{t("common.createdOn")}</th>
            <th className="px-4 py-3 font-medium text-right">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-ink-50/40 dark:hover:bg-ink-800/40">
              <td className="px-4 py-3">
                <OrderSideBadge side={order.side} />
              </td>
              <td className="px-4 py-3 font-ledger text-ink-700 dark:text-ink-200">
                {formatQuantity(order.quantity)}
              </td>
              <td className="px-4 py-3 font-ledger text-ink-700 dark:text-ink-200">{order.price.format()}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 font-ledger text-xs text-ink-400 dark:text-ink-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <OrderActions order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
