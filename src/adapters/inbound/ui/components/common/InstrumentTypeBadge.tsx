import { useTranslation } from "react-i18next";
import type { InstrumentType } from "../../../../../domain/enums/InstrumentType";
import { Badge, type BadgeProps } from "../ui/badge";

export const INSTRUMENT_TYPE_VARIANT: Record<InstrumentType, BadgeProps["variant"]> = {
  STOCK: "brand",
  BOND: "violet",
  ETF: "teal",
  FUND: "warning",
};

/** useInstrumentTypeLabels - libellés traduits par type d'instrument, partagés entre la table d'instruments, celle des investissements et le graphe d'allocation. */
export function useInstrumentTypeLabels(): Record<InstrumentType, string> {
  const { t } = useTranslation();
  return {
    STOCK: t("enums.instrumentType.stock"),
    BOND: t("enums.instrumentType.bond"),
    ETF: t("enums.instrumentType.etf"),
    FUND: t("enums.instrumentType.fund"),
  };
}

/** InstrumentTypeBadge - étiquette de type d'instrument, cohérente entre la table d'instruments et celle des investissements. */
export function InstrumentTypeBadge({ type }: { type: InstrumentType }) {
  const labels = useInstrumentTypeLabels();
  return <Badge variant={INSTRUMENT_TYPE_VARIANT[type]}>{labels[type]}</Badge>;
}
