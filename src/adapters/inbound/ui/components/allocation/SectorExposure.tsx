import type { ConsolidatedPosition } from "../../hooks/useConsolidatedPortfolio";
import { SECTOR_LABELS, type Sector } from "../../../../../domain/enums/Sector";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { Landmark } from "lucide-react";

interface SectorExposureProps {
  positions: ConsolidatedPosition[];
  isLoading?: boolean;
}

const UNKNOWN_SECTOR_LABEL = "Secteur non renseigné";

/**
 * SectorExposure - répartition du patrimoine par secteur d'activité.
 * Le secteur de chaque instrument est le vrai champ backend
 * (FinancialInstrument.sector) ; les instruments sans secteur renseigné
 * sont regroupés sous "Secteur non renseigné" plutôt qu'écartés.
 */
export function SectorExposure({ positions, isLoading }: SectorExposureProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  const totals = new Map<Sector | null, number>();
  let grandTotal = 0;
  for (const p of positions) {
    if (!p.instrument || !p.marketValue) continue;
    const sector = p.instrument.sector ?? null;
    const value = p.marketValue.amount.toNumber();
    totals.set(sector, (totals.get(sector) ?? 0) + value);
    grandTotal += value;
  }

  if (grandTotal === 0) {
    return (
      <EmptyState
        icon={Landmark}
        title="Aucune exposition à afficher"
        description="L'exposition sectorielle apparaîtra une fois votre portefeuille investi."
      />
    );
  }

  const rows = [...totals.entries()]
    .map(([sector, value]) => ({
      label: sector ? SECTOR_LABELS[sector] : UNKNOWN_SECTOR_LABEL,
      percentage: (value / grandTotal) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-ink-700">{row.label}</span>
            <span className="font-ledger font-semibold text-ink-900">
              {formatPercentage(row.percentage, { forceSign: false, decimals: 1 })}
            </span>
          </div>
          <Progress value={row.percentage} tone="brand" />
        </div>
      ))}
    </div>
  );
}
