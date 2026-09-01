import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatPerformance } from "../../../../../shared/utils/formatPerformance";
import { Badge } from "../ui/badge";
import { cn } from "../../../../../shared/utils/cn";

interface PerformanceBadgeProps {
  /** Variation en pourcentage (4.82, pas 0.0482), ou `null` si non calculable. */
  value: number | null;
  decimals?: number;
  className?: string;
}

const DIRECTION_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

const DIRECTION_VARIANT = {
  up: "success",
  down: "destructive",
  flat: "neutral",
} as const;

/**
 * PerformanceBadge - variation en pourcentage avec icône et couleur
 * cohérentes (vert hausse / rouge baisse / gris stable), utilisée aussi
 * bien dans le hero du Dashboard que dans les cartes de performance et,
 * plus tard, les tables d'investissements.
 */
export function PerformanceBadge({ value, decimals, className }: PerformanceBadgeProps) {
  if (value === null) {
    return (
      <Badge variant="neutral" className={className}>
        -
      </Badge>
    );
  }

  const { label, direction } = formatPerformance(value, decimals);
  const Icon = DIRECTION_ICON[direction];

  return (
    <Badge variant={DIRECTION_VARIANT[direction]} className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
