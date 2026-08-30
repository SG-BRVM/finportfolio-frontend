import { useState } from "react";
import type { FinancialInstrument } from "../../../../../domain/entities/FinancialInstrument";
import { EmptyState } from "../common/EmptyState";
import { LineChart, Pencil, Check, X, ChevronRight } from "lucide-react";
import { useUpdateNominalValue } from "../../hooks/useInstruments";
import { getErrorMessage } from "../../utils/errorMessage";
import { InstrumentDetailDrawer } from "./InstrumentDetailDrawer";
import { InstrumentTypeBadge } from "../common/InstrumentTypeBadge";

/** NominalValueCell - affiche la valeur nominale d'un instrument et permet
 * de la modifier en place (opération sur titres : division, regroupement). */
function NominalValueCell({ instrument }: { instrument: FinancialInstrument }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const updateNominalValue = useUpdateNominalValue();

  const startEditing = () => {
    setDraft(instrument.nominalValue ? instrument.nominalValue.amount.toString() : "");
    setIsEditing(true);
  };

  const cancel = () => {
    setIsEditing(false);
    updateNominalValue.reset();
  };

  const submit = async () => {
    if (!draft.trim() || Number(draft) <= 0) return;
    await updateNominalValue.mutateAsync({
      instrumentId: instrument.id,
      nominalValue: draft,
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="group inline-flex items-center gap-1.5 font-ledger text-ink-700 hover:text-brand-700"
        title="Modifier la valeur nominale"
      >
        {instrument.nominalValue ? instrument.nominalValue.format() : "—"}
        <Pencil className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-60" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") cancel();
          }}
          className="w-24 rounded-lg border border-ink-200 px-2 py-1 font-ledger text-sm focus:border-brand-400"
        />
        <button
          type="button"
          onClick={submit}
          disabled={updateNominalValue.isPending}
          className="rounded-md bg-brand-600 p-1 text-white transition hover:bg-brand-700 disabled:opacity-60"
          title="Valider"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={cancel}
          className="rounded-md bg-ink-100 p-1 text-ink-600 transition hover:bg-ink-200"
          title="Annuler"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {updateNominalValue.isError && (
        <p className="text-xs text-rose-600">{getErrorMessage(updateNominalValue.error)}</p>
      )}
    </div>
  );
}

export function InstrumentsTable({ instruments }: { instruments: FinancialInstrument[] }) {
  const [selected, setSelected] = useState<FinancialInstrument | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (instruments.length === 0) {
    return (
      <EmptyState
        icon={LineChart}
        title="Aucun instrument"
        description="Créez votre premier instrument financier ci-dessus."
      />
    );
  }

  const openDetail = (instrument: FinancialInstrument) => {
    setSelected(instrument);
    setDrawerOpen(true);
  };

  return (
    <>
      {/* Le scroll de la liste est contenu ici (max-h + overflow-y-auto),
          plutôt que de laisser toute la page défiler : l'en-tête reste
          visible (sticky) pendant qu'on parcourt les instruments. */}
      <div className="flex max-h-[calc(100vh-15rem)] flex-col overflow-hidden rounded-xl border border-ink-100 bg-white">
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-ink-100 bg-ink-50/95 text-xs uppercase tracking-wide text-ink-400 backdrop-blur">
              <tr>
                <th className="px-4 py-3 font-medium">Symbole</th>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Devise</th>
                <th className="px-4 py-3 font-medium">Prix actuel</th>
                <th className="px-4 py-3 font-medium">Valeur nominale</th>
                <th className="w-8 px-2 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {instruments.map((instrument) => (
                <tr
                  key={instrument.id}
                  onClick={() => openDetail(instrument)}
                  className="cursor-pointer transition hover:bg-brand-50/40"
                >
                  <td className="px-4 py-3 font-ledger font-semibold text-ink-900">
                    {instrument.symbol}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{instrument.name}</td>
                  <td className="px-4 py-3">
                    <InstrumentTypeBadge type={instrument.instrumentType} />
                  </td>
                  <td className="px-4 py-3 font-ledger text-ink-500">{instrument.currency}</td>
                  <td className="px-4 py-3 font-ledger text-ink-700">
                    {instrument.currentPrice.format()}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <NominalValueCell instrument={instrument} />
                  </td>
                  <td className="px-2 py-3 text-ink-300">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InstrumentDetailDrawer
        instrument={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}
