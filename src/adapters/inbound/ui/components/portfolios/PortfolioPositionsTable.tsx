import type { Position } from "../../../../../domain/entities/Position";
import type { FinancialInstrument } from "../../../../../domain/entities/FinancialInstrument";
import { formatQuantity } from "../../../../../shared/utils/formatNumber";
import { EmptyState } from "../common/EmptyState";
import { Layers } from "lucide-react";

interface PortfolioPositionsTableProps {
  positions: Position[];
  instruments: Map<string, FinancialInstrument>;
}

/** PortfolioPositionsTable - positions détenues, avec symbole résolu via les instruments chargés. */
export function PortfolioPositionsTable({ positions, instruments }: PortfolioPositionsTableProps) {
  if (positions.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Aucune position"
        description="Ce portefeuille ne détient encore aucun instrument."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-4 py-3 font-medium">Instrument</th>
            <th className="px-4 py-3 font-medium">Quantité</th>
            <th className="px-4 py-3 font-medium">Prix moyen</th>
            <th className="px-4 py-3 font-medium">Prix courant</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {positions.map((position) => {
            const instrument = instruments.get(position.instrumentId);
            return (
              <tr key={position.instrumentId} className="hover:bg-ink-50/40">
                <td className="px-4 py-3">
                  <span className="font-semibold text-ink-900">
                    {instrument?.symbol ?? position.instrumentId.slice(0, 8)}
                  </span>
                  {instrument && <span className="ml-2 text-xs text-ink-400">{instrument.name}</span>}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700">
                  {formatQuantity(position.quantity)}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700">
                  {position.averagePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 font-ledger text-ink-700">
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
