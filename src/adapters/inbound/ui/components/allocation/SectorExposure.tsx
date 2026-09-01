import type { ConsolidatedPosition } from "../../hooks/useConsolidatedPortfolio";
import type { Sector } from "../../../../../domain/enums/Sector";
import { useSectorLabels } from "../common/useSectorLabels";
import { useTranslation } from "react-i18next";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { Landmark } from "lucide-react";

interface SectorExposureProps {
  positions: ConsolidatedPosition[];
  isLoading?: boolean;
}

/**
 * SectorExposure - répartition du patrimoine par secteur d'activité.
 * Le secteur de chaque instrument est le vrai champ backend
 * (FinancialInstrument.sector) ; les instruments sans secteur renseigné
 * sont regroupés sous "Secteur non renseigné" plutôt qu'écartés.
 */
export function SectorExposure({ positions, isLoading }: SectorExposureProps) {
  const { t } = useTranslation();
  const sectorLabels = useSectorLabels();
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
        title={t("allocation.sector.emptyTitle")}
        description={t("allocation.sector.emptyDescription")}
      />
    );
  }

  const rows = [...totals.entries()]
    .map(([sector, value]) => ({
      label: sector ? sectorLabels[sector] : t("allocation.sector.unknown"),
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
