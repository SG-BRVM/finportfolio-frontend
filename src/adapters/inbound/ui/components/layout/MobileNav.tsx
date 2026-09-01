import { Link } from "react-router-dom";
import { SidebarNavigation } from "./SidebarNavigation";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { ROUTES } from "../../../../../shared/constants/routes";

interface MobileNavProps {
  onNavigate: () => void;
}

/** MobileNav - contenu du Sheet de navigation (< md). Ferme le Sheet à la sélection d'un item. */
export function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="space-y-0">
        <Link to={ROUTES.dashboard} onClick={onNavigate} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white">
            FP
          </div>
          <SheetTitle>FinPortfolio</SheetTitle>
        </Link>
      </SheetHeader>

      <SidebarNavigation
        onNavigate={onNavigate}
        className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin"
      />

      <div className="shrink-0 border-t border-ink-100 px-5 py-4 text-xs text-ink-400">
        Environnement bac à sable · Données de démonstration
      </div>
    </div>
  );
}
