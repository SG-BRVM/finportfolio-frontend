import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateInstrument } from "../../hooks/useInstruments";
import { getErrorMessage } from "../../utils/errorMessage";
import { INSTRUMENT_TYPES } from "../../../../../domain/enums/InstrumentType";
import { SECTORS, SECTOR_LABELS } from "../../../../../domain/enums/Sector";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

const schema = z.object({
  symbol: z.string().min(1, "Le symbole est requis.").max(20),
  name: z.string().min(1, "Le nom est requis."),
  instrumentType: z.enum(["STOCK", "BOND", "ETF", "FUND"]),
  currency: z
    .string()
    .min(3, "3 lettres requises.")
    .max(3, "3 lettres requises.")
    .transform((v) => v.toUpperCase()),
  currentPrice: z
    .string()
    .min(1, "Le prix est requis.")
    .refine((v) => Number(v) >= 0, "Le prix doit être positif ou nul."),
  nominalValue: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) > 0, "La valeur nominale doit être strictement positive."),
  sector: z.enum(["FINANCE", "TELECOMMUNICATIONS", "INDUSTRY", "ENERGY", "CONSUMER", "OTHER", ""]).optional(),
});

type FormValues = z.infer<typeof schema>;

/** InstrumentForm - création d'un instrument financier. */
export function InstrumentForm() {
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
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-ink-100 bg-white p-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Symbole</label>
          <input
            {...register("symbol")}
            type="text"
            placeholder="SNTS"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm uppercase focus:border-brand-400"
          />
          {errors.symbol && <p className="mt-1 text-xs text-rose-600">{errors.symbol.message}</p>}
        </div>
        <div>
          <Label>Type</Label>
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
        <label className="mb-1 block text-sm font-medium text-ink-700">Nom</label>
        <input
          {...register("name")}
          type="text"
          placeholder="Sonatel"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-400"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Devise</label>
          <input
            {...register("currency")}
            type="text"
            maxLength={3}
            placeholder="XOF"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm uppercase focus:border-brand-400"
          />
          {errors.currency && (
            <p className="mt-1 text-xs text-rose-600">{errors.currency.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Prix courant</label>
          <input
            {...register("currentPrice")}
            type="text"
            inputMode="decimal"
            placeholder="12500"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm focus:border-brand-400"
          />
          {errors.currentPrice && (
            <p className="mt-1 text-xs text-rose-600">{errors.currentPrice.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">
          Valeur nominale <span className="font-normal text-ink-400">(optionnel)</span>
        </label>
        <input
          {...register("nominalValue")}
          type="text"
          inputMode="decimal"
          placeholder="10000"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm focus:border-brand-400"
        />
        {errors.nominalValue && (
          <p className="mt-1 text-xs text-rose-600">{errors.nominalValue.message}</p>
        )}
      </div>
      <div>
        <Label>
          Secteur <span className="font-normal text-ink-400">(optionnel)</span>
        </Label>
        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Non renseigné" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {SECTOR_LABELS[sector]}
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
        {createInstrument.isPending ? "Création…" : "Créer l'instrument"}
      </Button>
    </form>
  );
}
