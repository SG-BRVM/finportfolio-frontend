import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useCreateOrder } from "../../hooks/useOrders";
import { usePortfolioSearch } from "../../hooks/usePortfolios";
import { useInstrumentSearch, useInstrument } from "../../hooks/useInstruments";
import { EntityAutocomplete } from "../common/EntityAutocomplete";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { getErrorMessage } from "../../utils/errorMessage";
import { ORDER_SIDES } from "../../../../../domain/enums/OrderSide";
import { Decimal } from "../../../../../domain/value-objects/Decimal";
import { Money } from "../../../../../domain/value-objects/Money";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const schema = z.object({
  portfolioId: z.string().min(1, "Le portefeuille est requis."),
  instrumentId: z.string().min(1, "L'instrument est requis."),
  side: z.enum(["BUY", "SELL"]),
  quantity: z
    .string()
    .min(1, "La quantité est requise.")
    .refine((v) => Number(v) > 0, "La quantité doit être strictement positive."),
  price: z
    .string()
    .min(1, "Le prix est requis.")
    .refine((v) => Number(v) > 0, "Le prix doit être strictement positif."),
});

type FormValues = z.infer<typeof schema>;

interface CreateOrderFormProps {
  defaultPortfolioId?: string;
  onCreated?: (orderId: string) => void;
  /** Appelé après création réussie, une fois le résumé de confirmation fermé (ex: fermer un Dialog englobant). */
  onDone?: () => void;
}

/**
 * CreateOrderForm - création d'un ordre BUY ou SELL.
 *
 * Flux en deux temps : la soumission du formulaire n'envoie rien
 * directement, elle ouvre un résumé de confirmation (montant estimé,
 * frais, montant total) dans une AlertDialog ; seul le clic sur
 * "Confirmer l'ordre" déclenche réellement la création. Le backend ne
 * facture aucun frais à ce jour (aucun endpoint de tarification) : les
 * frais affichés sont donc à 0, pour rester honnête plutôt que
 * d'inventer un modèle de frais.
 */
export function CreateOrderForm({ defaultPortfolioId, onCreated, onDone }: CreateOrderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      portfolioId: defaultPortfolioId ?? "",
      instrumentId: "",
      side: "BUY",
      quantity: "",
      price: "",
    },
  });
  const createOrder = useCreateOrder();
  const [portfolioQuery, setPortfolioQuery] = useState(defaultPortfolioId ?? "");
  const [instrumentQuery, setInstrumentQuery] = useState("");
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);
  const { data: portfolioOptions, isLoading: isSearchingPortfolios } =
    usePortfolioSearch(portfolioQuery);
  const { data: instrumentOptions, isLoading: isSearchingInstruments } =
    useInstrumentSearch(instrumentQuery);

  const watchedInstrumentId = useWatch({ control, name: "instrumentId" });
  const watchedQuantity = useWatch({ control, name: "quantity" });
  const watchedPrice = useWatch({ control, name: "price" });

  const { data: selectedInstrument } = useInstrument(watchedInstrumentId || undefined);
  const selectedPortfolio = (portfolioOptions ?? []).find((p) => p.id === portfolioQuery);

  const currency = selectedInstrument?.currency ?? selectedPortfolio?.currency ?? "XOF";

  const summary = useMemo(() => {
    try {
      if (!watchedQuantity || !watchedPrice) return null;
      if (Number(watchedQuantity) <= 0 || Number(watchedPrice) <= 0) return null;
      const estimatedAmount = Money.of(watchedPrice, currency).multiply(
        Decimal.fromString(watchedQuantity),
      );
      const fees = Money.zero(currency);
      return { estimatedAmount, fees, total: estimatedAmount.add(fees) };
    } catch {
      return null;
    }
  }, [watchedQuantity, watchedPrice, currency]);

  const requestConfirmation = handleSubmit((values) => {
    setPendingValues(values);
  });

  const handleConfirm = async () => {
    if (!pendingValues) return;
    const order = await createOrder.mutateAsync(pendingValues);
    setPendingValues(null);
    reset({ portfolioId: pendingValues.portfolioId, side: pendingValues.side, instrumentId: "", quantity: "", price: "" });
    setPortfolioQuery(pendingValues.portfolioId);
    setInstrumentQuery("");
    onCreated?.(order.id);
    onDone?.();
  };

  return (
    <>
      <form onSubmit={requestConfirmation} noValidate className="space-y-4 rounded-xl border border-ink-100 bg-white p-5">
        <div>
          <Controller
            name="portfolioId"
            control={control}
            render={({ field }) => (
              <EntityAutocomplete
                label="Portefeuille"
                placeholder="Tapez le nom du portefeuille…"
                value={field.value}
                onChange={(id) => {
                  field.onChange(id);
                  setPortfolioQuery(id);
                }}
                onBlur={field.onBlur}
                options={(portfolioOptions ?? []).map((p) => ({
                  id: p.id,
                  label: p.name,
                  sublabel: p.currency,
                }))}
                isLoading={isSearchingPortfolios}
                error={errors.portfolioId?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="instrumentId"
            control={control}
            render={({ field }) => (
              <EntityAutocomplete
                label="Instrument"
                placeholder="Tapez le symbole ou le nom de l'instrument…"
                value={field.value}
                onChange={(id) => {
                  field.onChange(id);
                  setInstrumentQuery(id);
                }}
                onBlur={field.onBlur}
                options={(instrumentOptions ?? []).map((i) => ({
                  id: i.id,
                  label: `${i.symbol} — ${i.name}`,
                  sublabel: i.currency,
                }))}
                isLoading={isSearchingInstruments}
                error={errors.instrumentId?.message}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Sens</Label>
            <Controller
              name="side"
              control={control}
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(v) => v && field.onChange(v)}
                >
                  {ORDER_SIDES.map((side) => (
                    <ToggleGroupItem
                      key={side}
                      value={side}
                      tone={side === "BUY" ? "buy" : "sell"}
                    >
                      {side === "BUY" ? "Achat" : "Vente"}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          </div>
          <div>
            <Label>Quantité</Label>
            <Input
              {...register("quantity")}
              type="text"
              inputMode="decimal"
              placeholder="100"
              className="font-ledger"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-600">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <Label>Prix</Label>
            <Input
              {...register("price")}
              type="text"
              inputMode="decimal"
              placeholder="115.00"
              className="font-ledger"
            />
            {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price.message}</p>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2 rounded-lg border border-ink-100 bg-ink-50/60 p-4 text-sm">
            <div className="flex items-center justify-between text-ink-500">
              <span>Montant estimé</span>
              <span className="font-ledger text-ink-800">{summary.estimatedAmount.format()}</span>
            </div>
            <div className="flex items-center justify-between text-ink-500">
              <span>Frais</span>
              <span className="font-ledger text-ink-800">{summary.fees.format()}</span>
            </div>
            <div className="flex items-center justify-between border-t border-ink-200 pt-2 font-semibold text-ink-900">
              <span>Montant total</span>
              <span className="font-ledger">{summary.total.format()}</span>
            </div>
          </div>
        )}

        {createOrder.isError && (
          <p className="text-sm text-rose-600">{getErrorMessage(createOrder.error)}</p>
        )}
        <Button type="submit" disabled={createOrder.isPending} className="w-full">
          Confirmer l'ordre
        </Button>
      </form>

      <ConfirmDialog
        open={pendingValues !== null}
        title="Confirmer votre ordre ?"
        description={
          pendingValues
            ? `Vous êtes sur le point de passer un ordre ${
                pendingValues.side === "BUY" ? "d'achat" : "de vente"
              } de ${pendingValues.quantity} titre(s)${
                summary ? ` pour un montant total de ${summary.total.format()}` : ""
              }. Cette action créera un ordre en attente d'exécution.`
            : ""
        }
        confirmLabel="Confirmer l'ordre"
        pending={createOrder.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setPendingValues(null)}
      />
    </>
  );
}
