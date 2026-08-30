import type { Order } from "../../../../../domain/entities/Order";
import { OrderSideBadge, OrderStatusBadge } from "../common/StatusBadge";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../../shared/utils/formatDate";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Sens</dt>
          <dd className="mt-1"><OrderSideBadge side={order.side} /></dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Statut</dt>
          <dd className="mt-1"><OrderStatusBadge status={order.status} /></dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Quantité</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-900">{formatQuantity(order.quantity)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Prix</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-900">{order.price.format()}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Portefeuille</dt>
          <dd className="mt-1 font-ledger text-xs text-ink-600">{order.portfolioId}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Instrument</dt>
          <dd className="mt-1 font-ledger text-xs text-ink-600">{order.instrumentId}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Créé le</dt>
          <dd className="mt-1 font-ledger text-sm text-ink-700">{formatDate(order.createdAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
