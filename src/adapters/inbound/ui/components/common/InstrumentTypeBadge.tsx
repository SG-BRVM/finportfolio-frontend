import type { InstrumentType } from "../../../../../domain/enums/InstrumentType";
import { Badge, type BadgeProps } from "../ui/badge";

export const INSTRUMENT_TYPE_VARIANT: Record<InstrumentType, BadgeProps["variant"]> = {
  STOCK: "brand",
  BOND: "violet",
  ETF: "teal",
  FUND: "warning",
};

export const INSTRUMENT_TYPE_LABELS: Record<InstrumentType, string> = {
  STOCK: "Actions",
  BOND: "Obligations",
  ETF: "ETF",
  FUND: "OPCVM",
};

/** InstrumentTypeBadge - étiquette de type d'instrument, cohérente entre la table d'instruments et celle des investissements. */
export function InstrumentTypeBadge({ type }: { type: InstrumentType }) {
  return <Badge variant={INSTRUMENT_TYPE_VARIANT[type]}>{INSTRUMENT_TYPE_LABELS[type]}</Badge>;
}
