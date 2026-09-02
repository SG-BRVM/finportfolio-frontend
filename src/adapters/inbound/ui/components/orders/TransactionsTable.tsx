import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { EnrichedTransaction } from "../../hooks/useOrdersOverview";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { OrderSideBadge } from "../common/StatusBadge";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { formatDate } from "../../../../../shared/utils/formatDate";

interface TransactionsTableProps {
  transactions: EnrichedTransaction[];
  isLoading?: boolean;
}

/**
 * TransactionsTable - historique des exécutions d'ordres (fills), tel que
 * persisté en base et agrégé tous portefeuilles confondus (voir
 * useConsolidatedTransactions).
 */
export function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-ink-100 dark:border-ink-800 px-4 py-3 last:border-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={t("orders.noRecentTransactions")}
        description={t("orders.transactionsWillAppear")}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("investments.instrument")}</TableHead>
          <TableHead>{t("orders.form.side")}</TableHead>
          <TableHead>{t("common.portfolio")}</TableHead>
          <TableHead className="text-right">{t("investments.quantity")}</TableHead>
          <TableHead className="text-right">{t("orders.price")}</TableHead>
          <TableHead className="text-right">{t("common.amount")}</TableHead>
          <TableHead>{t("orders.executedOn")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(({ transaction, portfolioName, instrument }) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="font-semibold text-ink-900 dark:text-ink-50">
                {instrument?.symbol ?? transaction.instrumentId.slice(0, 8)}
              </div>
              {instrument && <div className="text-xs text-ink-400 dark:text-ink-500">{instrument.name}</div>}
            </TableCell>
            <TableCell>
              <OrderSideBadge side={transaction.side} />
            </TableCell>
            <TableCell className="text-ink-500 dark:text-ink-400">{portfolioName}</TableCell>
            <TableCell className="text-right font-ledger">{formatQuantity(transaction.quantity)}</TableCell>
            <TableCell className="text-right font-ledger">{transaction.price.format()}</TableCell>
            <TableCell className="text-right font-ledger font-medium">
              {transaction.price.multiply(transaction.quantity).format()}
            </TableCell>
            <TableCell className="font-ledger text-xs text-ink-500 dark:text-ink-400">
              {formatDate(transaction.executedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
