import { Skeleton } from "../ui/skeleton";
import { PerformanceBadge } from "../common/PerformanceBadge";
import { useInstrumentHistory } from "../../hooks/useInstruments";

interface InstrumentVariationCellProps {
  instrumentId: string;
}

/**
 * InstrumentVariationCell - variation de cours réelle d'un instrument,
 * calculée à partir de son historique (`GET /instruments/{id}/history`,
 * même source que `InstrumentDetailDrawer`) plutôt que mockée : on prend
 * la dernière entrée `field === "current_price"` et on compare
 * `newValue`/`oldValue`.
 *
 * `null` (→ PerformanceBadge affiche "—") si l'instrument n'a encore
 * jamais été repriced (aucun historique de prix) : on n'invente pas de
 * variation là où le backend n'en a constaté aucune.
 */
export function InstrumentVariationCell({ instrumentId }: InstrumentVariationCellProps) {
  const { data: history, isLoading } = useInstrumentHistory(instrumentId);

  if (isLoading) {
    return <Skeleton className="ml-auto h-5 w-16" />;
  }

  const lastPriceChange = history?.find((entry) => entry.field === "current_price");
  const oldValue = lastPriceChange ? Number(lastPriceChange.oldValue) : NaN;
  const newValue = lastPriceChange ? Number(lastPriceChange.newValue) : NaN;

  const changePercent =
    lastPriceChange && Number.isFinite(oldValue) && oldValue !== 0 && Number.isFinite(newValue)
      ? ((newValue - oldValue) / oldValue) * 100
      : null;

  return <PerformanceBadge value={changePercent} />;
}
