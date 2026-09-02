import type { Order } from "../../../../../domain/entities/Order";
import { OrderSideBadge, OrderStatusBadge } from "../common/StatusBadge";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../../shared/utils/formatDate";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Sens</dt>
          <dd className="mt-1"><OrderSideBadge side={order.side} /></dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Statut</dt>
          <dd className="mt-1"><OrderStatusBadge status={order.status} /></dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Quantité</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-900 dark:text-ink-50">{formatQuantity(order.quantity)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Prix</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-900 dark:text-ink-50">{order.price.format()}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Portefeuille</dt>
          <dd className="mt-1 font-ledger text-xs text-ink-600 dark:text-ink-300">{order.portfolioId}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Instrument</dt>
          <dd className="mt-1 font-ledger text-xs text-ink-600 dark:text-ink-300">{order.instrumentId}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">Créé le</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-700 dark:text-ink-200">{formatDate(order.createdAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
