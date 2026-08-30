import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { NAV_GROUPS } from "./navigation";

/** Sidebar - navigation principale (desktop), groupée par domaine métier client. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white">
          FP
        </div>
        <span className="font-ledger text-[15px] font-semibold tracking-tight text-ink-900">
          FinPortfolio
        </span>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3 scrollbar-thin">
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
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"
                        }`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

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
