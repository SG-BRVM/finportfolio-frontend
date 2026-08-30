import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCreatePortfolio } from "../../hooks/usePortfolios";
import { useInvestorSearch } from "../../hooks/useInvestors";
import { EntityAutocomplete } from "../common/EntityAutocomplete";
import { getErrorMessage } from "../../utils/errorMessage";

const schema = z.object({
  investorId: z.string().min(1, "L'investisseur est requis."),
  name: z.string().min(1, "Le nom est requis."),
  currency: z
    .string()
    .min(3, "3 lettres requises.")
    .max(3, "3 lettres requises.")
    .transform((v) => v.toUpperCase()),
});

type FormValues = z.infer<typeof schema>;

interface PortfolioFormProps {
  defaultInvestorId?: string;
  onCreated?: (portfolioId: string) => void;
}

/** PortfolioForm - création d'un portefeuille rattaché à un investisseur. */
export function PortfolioForm({ defaultInvestorId, onCreated }: PortfolioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { investorId: defaultInvestorId ?? "", currency: "XOF" },
  });
  const createPortfolio = useCreatePortfolio();
  const [investorQuery, setInvestorQuery] = useState(defaultInvestorId ?? "");
  const { data: investorOptions, isLoading: isSearchingInvestors } =
    useInvestorSearch(investorQuery);

  const onSubmit = handleSubmit(async (values) => {
    const portfolio = await createPortfolio.mutateAsync(values);
    reset({ investorId: values.investorId, name: "", currency: values.currency });
    setInvestorQuery(values.investorId);
    onCreated?.(portfolio.id);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-ink-100 bg-white p-5">
      <div>
        <Controller
          name="investorId"
          control={control}
          render={({ field }) => (
            <EntityAutocomplete
              label="ID Investisseur"
              placeholder="Tapez le nom de l'investisseur…"
              value={field.value}
              onChange={(id) => {
                field.onChange(id);
                setInvestorQuery(id);
              }}
              onBlur={field.onBlur}
              options={(investorOptions ?? []).map((i) => ({ id: i.id, label: i.name }))}
              isLoading={isSearchingInvestors}
              error={errors.investorId?.message}
            />
          )}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">Nom du portefeuille</label>
        <input
          {...register("name")}
          type="text"
          placeholder="Retirement Portfolio"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-400"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">Devise</label>
        <input
          {...register("currency")}
          type="text"
          maxLength={3}
          placeholder="XOF"
          className="w-32 rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm uppercase focus:border-brand-400"
        />
        {errors.currency && (
          <p className="mt-1 text-xs text-rose-600">{errors.currency.message}</p>
        )}
      </div>
      {createPortfolio.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(createPortfolio.error)}</p>
      )}
      <button
        type="submit"
        disabled={createPortfolio.isPending}
        className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {createPortfolio.isPending ? "Création…" : "Créer le portefeuille"}
      </button>
    </form>
  );
}
