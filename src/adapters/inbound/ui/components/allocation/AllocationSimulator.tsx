import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calculator } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { InstrumentTypeBadge } from "../common/InstrumentTypeBadge";
import { EmptyState } from "../common/EmptyState";
import { Skeleton } from "../ui/skeleton";
import { useInstruments, useSimulateAllocation } from "../../hooks/useInstruments";
import { formatPercentage } from "../../../../../shared/utils/formatPercentage";
import type { AllocationWeightingStrategy } from "../../../../../domain/entities/AllocationSimulation";

/**
 * AllocationSimulator - simule l'achat d'un panier d'instruments pour un
 * capital et une stratégie de pondération donnés (équipondération ou
 * poids personnalisés par instrument), à partir des cours actuels en
 * base. Tous les calculs (quantités, valorisation, poids réel) sont
 * faits côté backend (`POST /instruments/allocation-simulation`) ; ce
 * composant se contente d'assembler la requête et d'afficher le résultat.
 */
export function AllocationSimulator() {
  const { t } = useTranslation();
  const strategyLabels: Record<AllocationWeightingStrategy, string> = {
    EQUAL: t("allocation.simulator.equalWeighting"),
    CUSTOM: t("allocation.simulator.customWeighting"),
  };
  const { data: instruments, isLoading: isLoadingInstruments } = useInstruments();
  const simulate = useSimulateAllocation();

  const currencies = useMemo(() => {
    const set = new Set<string>();
    for (const instrument of instruments ?? []) set.add(instrument.currency);
    return Array.from(set).sort();
  }, [instruments]);

  const [currency, setCurrency] = useState<string>("");
  const [capital, setCapital] = useState<string>("");
  const [strategy, setStrategy] = useState<AllocationWeightingStrategy>("EQUAL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customWeights, setCustomWeights] = useState<Record<string, string>>({});

  // Devise par défaut : la première disponible, une fois les instruments chargés.
  useEffect(() => {
    if (!currency && currencies.length > 0) setCurrency(currencies[0]);
  }, [currency, currencies]);

  const instrumentsInCurrency = useMemo(
    () => (instruments ?? []).filter((i) => i.currency === currency),
    [instruments, currency]
  );

  // Sélectionne tous les instruments de la devise choisie par défaut,
  // et à chaque changement de devise.
  useEffect(() => {
    setSelectedIds(new Set(instrumentsInCurrency.map((i) => i.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, instruments]);

  function toggleInstrument(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const selectedCount = instrumentsInCurrency.filter((i) => selectedIds.has(i.id)).length;
  const equalWeightPercent = selectedCount > 0 ? 100 / selectedCount : 0;

  const canSubmit =
    Number(capital) > 0 &&
    currency !== "" &&
    selectedCount > 0 &&
    (strategy === "EQUAL" ||
      instrumentsInCurrency
        .filter((i) => selectedIds.has(i.id))
        .some((i) => Number(customWeights[i.id] ?? 0) > 0));

  function handleSubmit() {
    if (!canSubmit) return;
    const instrumentIds = instrumentsInCurrency
      .filter((i) => selectedIds.has(i.id))
      .map((i) => i.id);
    simulate.mutate({
      capital,
      currency,
      strategy,
      instrumentIds,
      customWeights:
        strategy === "CUSTOM"
          ? Object.fromEntries(
              instrumentIds.map((id) => [id, customWeights[id] ?? "0"])
            )
          : undefined,
    });
  }

  const result = simulate.data;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="allocation-capital">{t("allocation.simulator.capitalToInvest")}</Label>
          <Input
            id="allocation-capital"
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="1 000 000"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
        </div>

        <div>
          <Label>{t("common.currency")}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={t("common.currency")} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t("allocation.simulator.weightingStrategy")}</Label>
          <Select
            value={strategy}
            onValueChange={(v) => setStrategy(v as AllocationWeightingStrategy)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(strategyLabels) as AllocationWeightingStrategy[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {strategyLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingInstruments ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : instrumentsInCurrency.length === 0 ? (
        <EmptyState
          title={t("allocation.simulator.noInstrumentsTitle")}
          description={t("allocation.simulator.noInstrumentsDescription")}
        />
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
                {t("allocation.simulator.instrumentsToInclude")}
              </p>
              <p className="text-xs text-ink-400 dark:text-ink-500">
                {t("allocation.simulator.instrumentsToIncludeDescription", {
                  selected: selectedCount,
                  total: instrumentsInCurrency.length,
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs font-medium text-brand-600 hover:underline"
                onClick={() => setSelectedIds(new Set(instrumentsInCurrency.map((i) => i.id)))}
              >
                {t("allocation.simulator.checkAll")}
              </button>
              <span className="text-ink-200">-</span>
              <button
                type="button"
                className="text-xs font-medium text-brand-600 hover:underline"
                onClick={() => setSelectedIds(new Set())}
              >
                {t("allocation.simulator.uncheckAll")}
              </button>
            </div>
          </div>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>{t("investments.instrument")}</TableHead>
              <TableHead>{t("instruments.history.currentPriceLabel")}</TableHead>
              <TableHead className="text-right">
                {t(strategy === "EQUAL" ? "allocation.simulator.weightEqual" : "allocation.simulator.weightPercent")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instrumentsInCurrency.map((instrument) => {
              const checked = selectedIds.has(instrument.id);
              return (
                <TableRow key={instrument.id}>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleInstrument(instrument.id, v === true)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900 dark:text-ink-50">{instrument.symbol}</span>
                      <span className="text-ink-400 dark:text-ink-500">{instrument.name}</span>
                      <InstrumentTypeBadge type={instrument.instrumentType} />
                    </div>
                  </TableCell>
                  <TableCell className="font-ledger">
                    {instrument.currentPrice.format()}
                  </TableCell>
                  <TableCell className="text-right">
                    {strategy === "EQUAL" ? (
                      <span className="font-ledger text-ink-600 dark:text-ink-300">
                        {checked ? formatPercentage(equalWeightPercent, { forceSign: false, decimals: 1 }) : "-"}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        disabled={!checked}
                        className="ml-auto w-24 text-right"
                        value={customWeights[instrument.id] ?? ""}
                        onChange={(e) =>
                          setCustomWeights((prev) => ({
                            ...prev,
                            [instrument.id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-400 dark:text-ink-500">
          {t(strategy === "CUSTOM"
            ? "allocation.simulator.customWeightsHint"
            : "allocation.simulator.equalWeightsHint")}
        </p>
        <Button onClick={handleSubmit} disabled={!canSubmit || simulate.isPending}>
          <Calculator className="mr-1.5 h-4 w-4" />
          {simulate.isPending ? t("allocation.simulator.simulating") : t("allocation.simulator.simulate")}
        </Button>
      </div>

      {simulate.isError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
          {simulate.error instanceof Error ? simulate.error.message : t("allocation.simulator.simulationFailed")}
        </p>
      )}

      {result && (
        <div className="space-y-3 border-t border-ink-100 dark:border-ink-800 pt-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat label={t("allocation.simulator.capital")} value={result.capital.format()} />
            <SummaryStat label={t("allocation.simulator.invested")} value={result.investedAmount.format()} />
            <SummaryStat label={t("allocation.simulator.cashRemaining")} value={result.cashRemaining.format()} />
            <SummaryStat
              label={t("allocation.simulator.investmentRate")}
              value={formatPercentage(result.investedPercent, { forceSign: false, decimals: 1 })}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("investments.instrument")}</TableHead>
                <TableHead className="text-right">{t("orders.price")}</TableHead>
                <TableHead className="text-right">{t("allocation.simulator.targetWeight")}</TableHead>
                <TableHead className="text-right">{t("allocation.simulator.quantityToBuy")}</TableHead>
                <TableHead className="text-right">{t("allocation.simulator.investedAmount")}</TableHead>
                <TableHead className="text-right">{t("allocation.simulator.actualWeight")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.lines.map((line) => (
                <TableRow key={line.instrumentId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900 dark:text-ink-50">{line.symbol}</span>
                      <span className="text-ink-400 dark:text-ink-500">{line.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-ledger">
                    {line.currentPrice.format()}
                  </TableCell>
                  <TableCell className="text-right font-ledger text-ink-500 dark:text-ink-400">
                    {formatPercentage(line.targetWeightPercent, { forceSign: false, decimals: 1 })}
                  </TableCell>
                  <TableCell className="text-right font-ledger font-semibold text-ink-900 dark:text-ink-50">
                    {line.quantity}
                  </TableCell>
                  <TableCell className="text-right font-ledger">
                    {line.investedAmount.format()}
                  </TableCell>
                  <TableCell className="text-right font-ledger text-ink-500 dark:text-ink-400">
                    {formatPercentage(line.actualWeightPercent, { forceSign: false, decimals: 1 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50/60 px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{label}</p>
      <p className="font-ledger text-base font-semibold text-ink-900 dark:text-ink-50">{value}</p>
    </div>
  );
}
