import type { Order } from "../../../../../domain/entities/Order";
import { OrderSideBadge, OrderStatusBadge } from "../common/StatusBadge";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { EmptyState } from "../common/EmptyState";
import { OrderActions } from "../orders/OrderActions";
import { ArrowLeftRight } from "lucide-react";

export function PortfolioOrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Aucun ordre"
        description="Aucun ordre n'a encore été passé sur ce portefeuille."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-4 py-3 font-medium">Sens</th>
            <th className="px-4 py-3 font-medium">Quantité</th>
            <th className="px-4 py-3 font-medium">Prix</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium">Créé le</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-ink-50/40">
              <td className="px-4 py-3">
                <OrderSideBadge side={order.side} />
              </td>
              <td className="px-4 py-3 font-ledger text-ink-700">
                {formatQuantity(order.quantity)}
              </td>
              <td className="px-4 py-3 font-ledger text-ink-700">{order.price.format()}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 font-ledger text-xs text-ink-400">
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
