import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Search } from "lucide-react";
import type { EnrichedOrder } from "../../hooks/useOrdersOverview";
import type { OrderStatus } from "../../../../../domain/enums/OrderStatus";
import { ORDER_STATUSES } from "../../../../../domain/enums/OrderStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { OrderSideBadge, OrderStatusBadge, useOrderStatusLabels } from "../common/StatusBadge";
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
  const { t } = useTranslation();
  const statusLabels = useOrderStatusLabels();
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
        title={t("orders.emptyTitle")}
        description={t("orders.emptyDescription")}
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
            placeholder={t("investments.searchPlaceholder")}
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
            <SelectValue placeholder={t("common.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("orders.allStatuses")}</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-ink-400">
          {t("orders.ordersCount", { count: filtered.length })}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t("common.noResults")} description={t("orders.noResultsDescription")} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("investments.instrument")}</TableHead>
                <TableHead>{t("common.type")}</TableHead>
                <TableHead>{t("common.portfolio")}</TableHead>
                <TableHead className="text-right">{t("investments.quantity")}</TableHead>
                <TableHead className="text-right">{t("orders.price")}</TableHead>
                <TableHead className="text-right">{t("common.amount")}</TableHead>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
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
                      <span className="text-xs text-ink-300">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <div className="flex items-center justify-between px-1 text-sm text-ink-500">
              <span>
                {t("common.pageOf", { current: currentPage + 1, total: pageCount })}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 font-medium text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("common.previous")}
                </button>
                <button
                  type="button"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 font-medium text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
