import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, TrendingUp } from "lucide-react";
import type { ConsolidatedPosition } from "../../hooks/useConsolidatedPortfolio";
import type { InstrumentType } from "../../../../../domain/enums/InstrumentType";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { InstrumentTypeBadge, useInstrumentTypeLabels } from "../common/InstrumentTypeBadge";
import { PerformanceBadge } from "../common/PerformanceBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";

type SortKey = "name" | "quantity" | "averagePrice" | "currentPrice" | "marketValue" | "performance";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 8;

interface InvestmentTableProps {
  positions: ConsolidatedPosition[];
  isLoading?: boolean;
}

function SortableHead({
  label,
  sortKey,
  activeSort,
  direction,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = activeSort === sortKey;
  const Icon = isActive ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 transition hover:text-ink-800 ${isActive ? "text-brand-700" : ""}`}
      >
        {label}
        <Icon className="h-3 w-3" />
      </button>
    </TableHead>
  );
}

/**
 * InvestmentTable - table professionnelle des positions consolidées,
 * tous portefeuilles confondus : recherche par instrument, filtre par
 * type, tri par colonne, pagination. Construite sur le composant Table
 * shadcn (voir components/ui/table.tsx).
 */
export function InvestmentTable({ positions, isLoading }: InvestmentTableProps) {
  const { t } = useTranslation();
  const instrumentTypeLabels = useInstrumentTypeLabels();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InstrumentType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return positions.filter((p) => {
      if (typeFilter !== "all" && p.instrument?.instrumentType !== typeFilter) return false;
      if (!query) return true;
      return (
        p.instrument?.symbol.toLowerCase().includes(query) ||
        p.instrument?.name.toLowerCase().includes(query) ||
        p.portfolioName.toLowerCase().includes(query)
      );
    });
  }, [positions, search, typeFilter]);

  const sorted = useMemo(() => {
    const withValue = (p: ConsolidatedPosition) => p.marketValue?.amount.toNumber() ?? -Infinity;
    const factor = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return factor * (a.instrument?.symbol ?? "").localeCompare(b.instrument?.symbol ?? "");
        case "quantity":
          return factor * (a.position.quantity.toNumber() - b.position.quantity.toNumber());
        case "averagePrice":
          return factor * (a.position.averagePrice.toNumber() - b.position.averagePrice.toNumber());
        case "currentPrice":
          return (
            factor *
            ((a.instrument?.currentPrice.amount.toNumber() ?? 0) -
              (b.instrument?.currentPrice.amount.toNumber() ?? 0))
          );
        case "performance":
          return factor * ((a.performancePercentage ?? -Infinity) - (b.performancePercentage ?? -Infinity));
        case "marketValue":
        default:
          return factor * (withValue(a) - withValue(b));
      }
    });
  }, [filtered, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = sorted.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

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

  if (positions.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title={t("investments.emptyTitle")}
        description={t("investments.emptyDescription")}
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
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v as InstrumentType | "all");
            setPage(0);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("common.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("investments.allTypes")}</SelectItem>
            {(Object.keys(instrumentTypeLabels) as InstrumentType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {instrumentTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-ink-400">
          {t("investments.positionsCount", { count: sorted.length })}
        </span>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title={t("common.noResults")} description={t("investments.noResultsDescription")} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label={t("investments.instrument")} sortKey="name" activeSort={sortKey} direction={sortDirection} onSort={handleSort} />
                <TableHead>{t("common.type")}</TableHead>
                <TableHead>{t("common.portfolio")}</TableHead>
                <SortableHead label={t("investments.quantity")} sortKey="quantity" activeSort={sortKey} direction={sortDirection} onSort={handleSort} className="text-right" />
                <SortableHead label={t("investments.averagePrice")} sortKey="averagePrice" activeSort={sortKey} direction={sortDirection} onSort={handleSort} className="text-right" />
                <SortableHead label={t("investments.currentPrice")} sortKey="currentPrice" activeSort={sortKey} direction={sortDirection} onSort={handleSort} className="text-right" />
                <SortableHead label={t("investments.marketValue")} sortKey="marketValue" activeSort={sortKey} direction={sortDirection} onSort={handleSort} className="text-right" />
                <SortableHead label={t("investments.performance")} sortKey="performance" activeSort={sortKey} direction={sortDirection} onSort={handleSort} className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((p) => (
                <TableRow key={`${p.portfolioId}-${p.instrumentId}`}>
                  <TableCell>
                    <div className="font-semibold text-ink-900">{p.instrument?.symbol ?? p.instrumentId.slice(0, 8)}</div>
                    {p.instrument && <div className="text-xs text-ink-400">{p.instrument.name}</div>}
                  </TableCell>
                  <TableCell>{p.instrument && <InstrumentTypeBadge type={p.instrument.instrumentType} />}</TableCell>
                  <TableCell className="text-ink-500">{p.portfolioName}</TableCell>
                  <TableCell className="text-right font-ledger">{formatQuantity(p.position.quantity)}</TableCell>
                  <TableCell className="text-right font-ledger">{p.position.averagePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-ledger">
                    {p.instrument ? p.instrument.currentPrice.format() : "-"}
                  </TableCell>
                  <TableCell className="text-right font-ledger font-medium">
                    {p.marketValue ? p.marketValue.format() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <PerformanceBadge value={p.performancePercentage} />
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
