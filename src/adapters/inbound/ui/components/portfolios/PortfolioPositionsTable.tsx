import type { Position } from "../../../../../domain/entities/Position";
import type { FinancialInstrument } from "../../../../../domain/entities/FinancialInstrument";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { EmptyState } from "../common/EmptyState";
import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PortfolioPositionsTableProps {
  positions: Position[];
  instruments: Map<string, FinancialInstrument>;
}

/** PortfolioPositionsTable - positions détenues, avec symbole résolu via les instruments chargés. */
export function PortfolioPositionsTable({ positions, instruments }: PortfolioPositionsTableProps) {
  const { t } = useTranslation();
  if (positions.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title={t("portfolios.positions.emptyTitle")}
        description={t("portfolios.positions.emptyDescription")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400 dark:text-ink-500">
          <tr>
            <th className="px-4 py-3 font-medium">{t("investments.instrument")}</th>
            <th className="px-4 py-3 font-medium">{t("investments.quantity")}</th>
            <th className="px-4 py-3 font-medium">{t("investments.averagePrice")}</th>
            <th className="px-4 py-3 font-medium">{t("portfolios.positions.currentPrice")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
          {positions.map((position) => {
            const instrument = instruments.get(position.instrumentId);
            return (
              <tr key={position.instrumentId} className="hover:bg-ink-50/40 dark:hover:bg-ink-800/40">
                <td className="px-4 py-3">
                  <span className="font-semibold text-ink-900 dark:text-ink-50">
                    {instrument?.symbol ?? position.instrumentId.slice(0, 8)}
                  </span>
                  {instrument && <span className="ml-2 text-xs text-ink-400 dark:text-ink-500">{instrument.name}</span>}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700 dark:text-ink-200">
                  {formatQuantity(position.quantity)}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700 dark:text-ink-200">
                  {position.averagePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700 dark:text-ink-200">
                  {instrument ? instrument.currentPrice.format() : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
