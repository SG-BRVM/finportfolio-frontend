import { NavLink } from "react-router-dom";
import { NAV_GROUPS } from "./navigation";
import { SheetHeader, SheetTitle } from "../ui/sheet";

interface MobileNavProps {
  onNavigate: () => void;
}

/** MobileNav - contenu du Sheet de navigation (< md). Ferme le Sheet à la sélection d'un item. */
export function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="flex-row items-center gap-2 space-y-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white">
          FP
        </div>
        <SheetTitle>FinPortfolio</SheetTitle>
      </SheetHeader>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label ?? `top-${index}`}>
            {group.label && (
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-300">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-600" : "text-ink-400"}`} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-ink-100 px-5 py-4 text-xs text-ink-400">
        Environnement bac à sable · Données de démonstration
      </div>
    </div>
  );
}
