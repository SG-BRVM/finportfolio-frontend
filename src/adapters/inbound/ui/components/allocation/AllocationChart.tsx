import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ConsolidatedPosition } from "../../hooks/useConsolidatedPortfolio";
import { useInstrumentTypeLabels } from "../common/InstrumentTypeBadge";
import { useTranslation } from "react-i18next";
import type { InstrumentType } from "../../../../../domain/enums/InstrumentType";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../common/EmptyState";
import { PieChart as PieChartIcon } from "lucide-react";

const TYPE_COLORS: Record<InstrumentType, string> = {
  STOCK: "#2547e4",
  BOND: "#7c3aed",
  ETF: "#0d9488",
  FUND: "#d97706",
};

interface AllocationSlice {
  type: InstrumentType;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface AllocationChartProps {
  positions: ConsolidatedPosition[];
  isLoading?: boolean;
}

/**
 * AllocationChart - répartition du patrimoine par classe d'actifs
 * (Actions / Obligations / OPCVM / ETF), calculée à partir des vraies
 * positions et de leur valorisation courante - aucune donnée mockée ici,
 * contrairement à l'exposition sectorielle (voir SectorExposure).
 */
export function AllocationChart({ positions, isLoading }: AllocationChartProps) {
  const { t } = useTranslation();
  const instrumentTypeLabels = useInstrumentTypeLabels();
  if (isLoading) {
    return <Skeleton className="mx-auto h-64 w-64 rounded-full" />;
  }

  const totals = new Map<InstrumentType, number>();
  let grandTotal = 0;
  for (const p of positions) {
    if (!p.instrument || !p.marketValue) continue;
    const value = p.marketValue.amount.toNumber();
    totals.set(p.instrument.instrumentType, (totals.get(p.instrument.instrumentType) ?? 0) + value);
    grandTotal += value;
  }

  if (grandTotal === 0) {
    return (
      <EmptyState
        icon={PieChartIcon}
        title={t("allocation.emptyTitle")}
        description={t("allocation.emptyDescription")}
      />
    );
  }

  const slices: AllocationSlice[] = (Object.keys(instrumentTypeLabels) as InstrumentType[])
    .map((type) => {
      const value = totals.get(type) ?? 0;
      return {
        type,
        label: instrumentTypeLabels[type],
        value,
        percentage: (value / grandTotal) * 100,
        color: TYPE_COLORS[type],
      };
    })
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="h-64 w-64 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.type} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_value: number, _name, entry) => [
                formatPercentage((entry?.payload?.percentage as number) ?? 0, { forceSign: false, decimals: 1 }),
                entry?.payload?.label as string,
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full max-w-xs space-y-2.5">
        {slices.map((slice) => (
          <li key={slice.type} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-700 dark:text-ink-200">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
              {slice.label}
            </span>
            <span className="font-ledger font-semibold text-ink-900 dark:text-ink-50">
              {formatPercentage(slice.percentage, { forceSign: false, decimals: 1 })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
