import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Clock, History as HistoryIcon, PlusCircle, RefreshCw, Pencil } from "lucide-react";
import type { FinancialInstrument } from "../../../../../domain/entities/FinancialInstrument";
import type { InstrumentHistoryEntry } from "../../../../../domain/entities/InstrumentHistoryEntry";
import { useSectorLabels } from "../common/useSectorLabels";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../../../../infrastructure/i18n/i18n";
import { Badge, type BadgeProps } from "../ui/badge";
import { useInstrumentHistory } from "../../hooks/useInstruments";
import { getErrorMessage } from "../../utils/errorMessage";

const TYPE_VARIANT: Record<string, BadgeProps["variant"]> = {
  STOCK: "brand",
  BOND: "violet",
  ETF: "teal",
  FUND: "warning",
};

function useSourceLabels(): Record<InstrumentHistoryEntry["source"], string> {
  const { t } = useTranslation();
  return {
    creation: t("instruments.history.creation"),
    manual_correction: t("instruments.history.manualCorrection"),
    market_refresh: t("instruments.history.marketRefresh"),
  };
}

const SOURCE_ICON: Record<InstrumentHistoryEntry["source"], typeof PlusCircle> = {
  creation: PlusCircle,
  manual_correction: Pencil,
  market_refresh: RefreshCw,
};

function useFieldLabels(): Record<InstrumentHistoryEntry["field"], string> {
  const { t } = useTranslation();
  return {
    created: t("instruments.history.instrumentCreated"),
    current_price: t("portfolios.positions.currentPrice"),
    nominal_value: t("instruments.form.nominalValue"),
  };
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(value: string | null, currency: string): string {
  if (value === null) return "-";
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return `${new Intl.NumberFormat(getIntlLocale()).format(n)} ${currency}`;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 font-ledger text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

function HistoryRow({ entry, currency }: { entry: InstrumentHistoryEntry; currency: string }) {
  const { t } = useTranslation();
  const sourceLabels = useSourceLabels();
  const fieldLabels = useFieldLabels();
  const Icon = SOURCE_ICON[entry.source];
  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      <span className="absolute bottom-0 left-[15px] top-6 w-px bg-ink-100 last:hidden" />
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-4 ring-white">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <p className="text-sm font-medium text-ink-900">{fieldLabels[entry.field]}</p>
          <p className="text-xs text-ink-400">{formatDateTime(entry.changedAt)}</p>
        </div>
        <p className="mt-0.5 text-xs text-ink-500">{sourceLabels[entry.source]}</p>
        {entry.field !== "created" && (
          <p className="mt-1 font-ledger text-sm text-ink-700">
            {formatAmount(entry.oldValue, currency)}
            <span className="mx-1.5 text-ink-300">→</span>
            <span className="font-semibold text-ink-900">
              {formatAmount(entry.newValue, currency)}
            </span>
          </p>
        )}
        {entry.field === "created" && (
          <p className="mt-1 font-ledger text-sm text-ink-700">
            {t("instruments.history.initialPrice")} <span className="font-semibold text-ink-900">
              {formatAmount(entry.newValue, currency)}
            </span>
          </p>
        )}
      </div>
    </li>
  );
}

export function InstrumentDetailDrawer({
  instrument,
  open,
  onOpenChange,
}: {
  instrument: FinancialInstrument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const sectorLabels = useSectorLabels();
  const { data: history, isLoading, isError, error } = useInstrumentHistory(
    open ? instrument?.id : undefined
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-950/40 animate-overlay-in" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl animate-drawer-in focus:outline-none"
          aria-describedby={undefined}
        >
          {instrument && (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-6 py-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <DialogPrimitive.Title className="truncate font-ledger text-lg font-semibold text-ink-900">
                      {instrument.symbol}
                    </DialogPrimitive.Title>
                    <Badge variant={TYPE_VARIANT[instrument.instrumentType] ?? "neutral"}>
                      {instrument.instrumentType}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-500">{instrument.name}</p>
                </div>
                <DialogPrimitive.Close className="flex-none rounded-md p-1 text-ink-400 transition hover:bg-ink-50 hover:text-ink-600">
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t("common.close")}</span>
                </DialogPrimitive.Close>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-ink-100 bg-ink-50/40 p-4">
                  <InfoField label={t("common.currency")} value={instrument.currency} />
                  <InfoField label={t("instruments.history.currentPriceLabel")} value={instrument.currentPrice.format()} />
                  <InfoField
                    label={t("instruments.form.nominalValue")}
                    value={instrument.nominalValue ? instrument.nominalValue.format() : "-"}
                  />
                  <InfoField
                    label={t("instruments.form.sector")}
                    value={instrument.sector ? sectorLabels[instrument.sector] : "-"}
                  />
                  <InfoField label={t("instruments.history.identifier")} value={instrument.id.slice(0, 8) + "…"} />
                </div>

                <div className="mt-5 flex items-center gap-4 text-xs text-ink-500">
                  <div className="flex items-center gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5" />
                    {t("common.createdOn")} {formatDateTime(instrument.createdAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t("instruments.history.updatedOn")} {formatDateTime(instrument.updatedAt)}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                    <HistoryIcon className="h-4 w-4 text-ink-400" />
                    {t("instruments.history.title")}
                  </div>

                  {isLoading && (
                    <p className="text-sm text-ink-400">{t("instruments.history.loading")}</p>
                  )}
                  {isError && (
                    <p className="text-sm text-rose-600">{getErrorMessage(error)}</p>
                  )}
                  {!isLoading && !isError && history && history.length === 0 && (
                    <p className="text-sm text-ink-400">{t("instruments.history.empty")}</p>
                  )}
                  {!isLoading && !isError && history && history.length > 0 && (
                    <ul>
                      {history.map((entry) => (
                        <HistoryRow key={entry.id} entry={entry} currency={instrument.currency} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
