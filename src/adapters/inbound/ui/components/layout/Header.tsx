import { useBackendHealth } from "../../hooks/useHealth";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/** Header - barre supérieure avec le statut live du backend. */
export function Header() {
  const { data, isLoading, isError } = useBackendHealth();
  const isUp = !isLoading && !isError && data?.health.status === "ok";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-100 bg-white px-6">
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={`h-2 w-2 rounded-full ${
                isLoading ? "bg-ink-300" : isUp ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="text-ink-500">
              Backend {isLoading ? "…" : isUp ? "opérationnel" : "indisponible"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isLoading
            ? "Vérification en cours…"
            : isUp
              ? `Statut API: ${data?.health.status}`
              : "Le backend ne répond pas au health check."}
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
