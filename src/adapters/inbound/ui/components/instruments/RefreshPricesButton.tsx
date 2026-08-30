import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { useRefreshMarketPrices } from "../../hooks/useMarketData";
import { getErrorMessage } from "../../utils/errorMessage";

/**
 * RefreshPricesButton - déclenche à la demande le connecteur de scraping
 * manuel (page "Actions" de la BRVM) et affiche le bilan de l'exécution.
 *
 * Volontairement manuel : aucun job planifié ne tourne derrière ce
 * bouton, voir RefreshMarketPricesUseCase côté backend.
 */
export function RefreshPricesButton() {
  const refreshPrices = useRefreshMarketPrices();
  const result = refreshPrices.data;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Cours BRVM</p>
          <p className="text-xs text-ink-500">
            Récupère manuellement les derniers cours de clôture publiés par la BRVM.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refreshPrices.mutate()}
          disabled={refreshPrices.isPending}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshPrices.isPending ? "animate-spin" : ""}`} />
          {refreshPrices.isPending ? "Récupération..." : "Rafraîchir les cours"}
        </Button>
      </div>

      {refreshPrices.isError && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{getErrorMessage(refreshPrices.error)}</span>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              {result.updatedCount} instrument{result.updatedCount > 1 ? "s" : ""} mis à jour
              {refreshPrices.submittedAt
                ? ` · ${formatDate(new Date(refreshPrices.submittedAt))}`
                : ""}
            </span>
          </div>
          {result.unmatchedSymbols.length > 0 && (
            <p className="text-amber-700">
              Symboles cotés non suivis : {result.unmatchedSymbols.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
