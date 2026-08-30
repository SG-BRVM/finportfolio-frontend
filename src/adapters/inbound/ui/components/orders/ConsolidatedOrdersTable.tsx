import { useMemo, useState } from "react";
import { ArrowLeftRight, Search } from "lucide-react";
import type { EnrichedOrder } from "../../hooks/useOrdersOverview";
import type { OrderStatus } from "../../../../../domain/enums/OrderStatus";
import { ORDER_STATUSES } from "../../../../../domain/enums/OrderStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { OrderSideBadge, OrderStatusBadge } from "../common/StatusBadge";
import { OrderActions } from "./OrderActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDateShort } from "../../../../../shared/utils/formatDate";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  EXECUTED: "Exécuté",
  CANCELLED: "Annulé",
};

const PAGE_SIZE = 8;

interface ConsolidatedOrdersTableProps {
  orders: EnrichedOrder[];
  isLoading?: boolean;
}

/**
 * ConsolidatedOrdersTable - table professionnelle des ordres, tous
 * portefeuilles connus confondus : recherche, filtre par statut,
 * pagination. Construite sur le composant Table shadcn, à l'image de
 * InvestmentTable.
 */
export function ConsolidatedOrdersTable({ orders, isLoading }: ConsolidatedOrdersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter(({ order, portfolioName, instrument }) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!query) return true;
      return (
        instrument?.symbol.toLowerCase().includes(query) ||
        instrument?.name.toLowerCase().includes(query) ||
        portfolioName.toLowerCase().includes(query)
      );
    });
  }, [orders, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-ink-100 px-4 py-3 last:border-0">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Aucun ordre récent"
        description="Vos ordres apparaîtront ici une fois créés."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Rechercher un instrument, un portefeuille…"
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as OrderStatus | "all");
            setPage(0);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-ink-400">
          {filtered.length} ordre{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun résultat" description="Aucun ordre ne correspond à votre recherche." />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Portefeuille</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map(({ order, portfolioName, instrument }) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-semibold text-ink-900">{instrument?.symbol ?? order.instrumentId.slice(0, 8)}</div>
                    {instrument && <div className="text-xs text-ink-400">{instrument.name}</div>}
                  </TableCell>
                  <TableCell>
                    <OrderSideBadge side={order.side} />
                  </TableCell>
                  <TableCell className="text-ink-500">{portfolioName}</TableCell>
                  <TableCell className="text-right font-ledger">{formatQuantity(order.quantity)}</TableCell>
                  <TableCell className="text-right font-ledger">{order.price.format()}</TableCell>
                  <TableCell className="text-right font-ledger font-medium">
                    {order.price.multiply(order.quantity).format()}
                  </TableCell>
                  <TableCell className="font-ledger text-xs text-ink-500">
                    {formatDateShort(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "PENDING" ? (
                      <OrderActions order={order} />
                    ) : (
                      <span className="text-xs text-ink-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <div className="flex items-center justify-between px-1 text-sm text-ink-500">
              <span>
                Page {currentPage + 1} sur {pageCount}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 font-medium text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 font-medium text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
