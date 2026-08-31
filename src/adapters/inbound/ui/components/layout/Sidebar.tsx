import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarNavigation } from "./SidebarNavigation";
import { ROUTES } from "../../../../../shared/constants/routes";

/** Sidebar - navigation principale (desktop), hiérarchique avec sections repliables par domaine métier client. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
      <Link
        to={ROUTES.dashboard}
        className="flex h-16 shrink-0 items-center gap-2 px-5 transition hover:bg-ink-50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white">
          FP
        </div>
        <span className="font-ledger text-[15px] font-semibold tracking-tight text-ink-900">
          FinPortfolio
        </span>
      </Link>

      <SidebarNavigation className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin" />

      <div className="shrink-0 border-t border-ink-100 px-4 py-4">
        <div className="flex items-start gap-2 rounded-lg bg-ink-50 px-3 py-2.5 text-xs text-ink-400">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
          <span>
            Environnement bac à sable
            <br />
            Données de démonstration
          </span>
        </div>
      </div>
    </aside>
  );
}
