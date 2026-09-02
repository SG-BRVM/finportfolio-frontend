import { useForm, Controller } from "react-hook-form";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateInstrument } from "../../hooks/useInstruments";
import { getErrorMessage } from "../../utils/errorMessage";
import { INSTRUMENT_TYPES } from "../../../../../domain/enums/InstrumentType";
import { SECTORS } from "../../../../../domain/enums/Sector";
import { useSectorLabels } from "../common/useSectorLabels";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

function buildSchema(t: TFunction) {
  return z.object({
    symbol: z.string().min(1, t("instruments.form.symbolRequired")).max(20),
    name: z.string().min(1, t("instruments.form.nameRequired")),
    instrumentType: z.enum(["STOCK", "BOND", "ETF", "FUND"]),
    currency: z
      .string()
      .min(3, t("portfolios.form.threeLettersRequired"))
      .max(3, t("portfolios.form.threeLettersRequired"))
      .transform((v) => v.toUpperCase()),
    currentPrice: z
      .string()
      .min(1, t("instruments.form.priceRequired"))
      .refine((v) => Number(v) >= 0, t("instruments.form.pricePositiveOrZero")),
    nominalValue: z
      .string()
      .optional()
      .refine((v) => !v || Number(v) > 0, t("instruments.form.nominalValuePositive")),
    sector: z.enum(["FINANCE", "TELECOMMUNICATIONS", "INDUSTRY", "ENERGY", "CONSUMER", "OTHER", ""]).optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

/** InstrumentForm - création d'un instrument financier. */
export function InstrumentForm() {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => buildSchema(t), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps
  const sectorLabels = useSectorLabels();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currency: "XOF", instrumentType: "STOCK", sector: "" },
  });
  const createInstrument = useCreateInstrument();

  const onSubmit = handleSubmit(async (values) => {
    await createInstrument.mutateAsync({
      ...values,
      nominalValue: values.nominalValue?.trim() ? values.nominalValue : undefined,
      sector: values.sector ? values.sector : undefined,
    });
    reset({ currency: values.currency, instrumentType: values.instrumentType, sector: "" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">{t("instruments.form.symbol")}</label>
          <input
            {...register("symbol")}
            type="text"
            placeholder="SNTS"
            className="bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 font-ledger text-sm uppercase focus:border-brand-400"
          />
          {errors.symbol && <p className="mt-1 text-xs text-rose-600">{errors.symbol.message}</p>}
        </div>
        <div>
          <Label>{t("common.type")}</Label>
          <Controller
            name="instrumentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">{t("common.name")}</label>
        <input
          {...register("name")}
          type="text"
          placeholder="Sonatel"
          className="bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-brand-400"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">{t("common.currency")}</label>
          <input
            {...register("currency")}
            type="text"
            maxLength={3}
            placeholder="XOF"
            className="bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 font-ledger text-sm uppercase focus:border-brand-400"
          />
          {errors.currency && (
            <p className="mt-1 text-xs text-rose-600">{errors.currency.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">{t("portfolios.positions.currentPrice")}</label>
          <input
            {...register("currentPrice")}
            type="text"
            inputMode="decimal"
            placeholder="12500"
            className="bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 font-ledger text-sm focus:border-brand-400"
          />
          {errors.currentPrice && (
            <p className="mt-1 text-xs text-rose-600">{errors.currentPrice.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">
          {t("instruments.form.nominalValue")} <span className="font-normal text-ink-400 dark:text-ink-500">({t("common.optional")})</span>
        </label>
        <input
          {...register("nominalValue")}
          type="text"
          inputMode="decimal"
          placeholder="10000"
          className="bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 font-ledger text-sm focus:border-brand-400"
        />
        {errors.nominalValue && (
          <p className="mt-1 text-xs text-rose-600">{errors.nominalValue.message}</p>
        )}
      </div>
      <div>
        <Label>
          {t("instruments.form.sector")} <span className="font-normal text-ink-400 dark:text-ink-500">({t("common.optional")})</span>
        </Label>
        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("instruments.form.notProvided")} />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sectorLabels[sector]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {createInstrument.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(createInstrument.error)}</p>
      )}
      <Button type="submit" disabled={createInstrument.isPending} className="w-full">
        {createInstrument.isPending ? t("instruments.form.creating") : t("instruments.create")}
      </Button>
    </form>
  );
}
