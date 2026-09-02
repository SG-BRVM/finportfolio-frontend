import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { NAV_GROUPS, getActiveGroupId, type NavItem } from "./navigation";
import { cn } from "../../../../../shared/utils/cn";

interface SidebarNavigationProps {
  /** Appelé après un clic sur un lien (ferme le Sheet en mobile). */
  onNavigate?: () => void;
  className?: string;
}

/**
 * SidebarNavigation - navigation hiérarchique partagée par le Sidebar
 * desktop et le MobileNav (Sheet) : "Tableau de bord" en lien direct,
 * puis les autres NAV_GROUPS rendus comme des sections repliables.
 *
 * Chaque section conserve son propre état ouvert/fermé de façon
 * indépendante (AccordionPrimitive type="multiple") : ouvrir une section
 * ne referme pas les autres, et l'état choisi par l'utilisateur reste
 * intact quelle que soit la page consultée ensuite (le composant n'est
 * pas remonté lors de la navigation). La section correspondant à la
 * route active est en plus ouverte automatiquement (au chargement, au
 * refresh, ou en arrivant sur une de ses pages depuis ailleurs que la
 * sidebar) - sans jamais refermer une section déjà ouverte par ailleurs.
 */
export function SidebarNavigation({ onNavigate, className }: SidebarNavigationProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activeGroupId = getActiveGroupId(location.pathname);

  const [openSections, setOpenSections] = useState<string[]>(activeGroupId ? [activeGroupId] : []);

  // Ajoute la section active à l'ensemble déjà ouvert, sans jamais en
  // retirer une autre : l'utilisateur peut garder plusieurs sections
  // dépliées en parcourant l'application.
  useEffect(() => {
    if (activeGroupId) {
      setOpenSections((prev) => (prev.includes(activeGroupId) ? prev : [...prev, activeGroupId]));
    }
  }, [activeGroupId]);

  const directGroups = NAV_GROUPS.filter((group) => !group.labelKey);
  const sectionGroups = NAV_GROUPS.filter((group) => group.labelKey);

  return (
    <nav className={cn("space-y-1", className)}>
      {directGroups.map((group) => (
        <div key={group.id} className="space-y-0.5 pb-3">
          {group.items.map((item) => (
            <SidebarNavLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}

      <AccordionPrimitive.Root type="multiple" value={openSections} onValueChange={setOpenSections}>
        {sectionGroups.map((group) => {
          const SectionIcon = group.icon;

          return (
            <AccordionPrimitive.Item key={group.id} value={group.id} className="border-none">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2",
                    "text-[11px] font-semibold uppercase tracking-wider text-ink-300 transition dark:text-ink-500",
                    "hover:bg-ink-50 hover:text-ink-500 dark:hover:bg-ink-800 dark:hover:text-ink-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {SectionIcon && <SectionIcon className="h-3.5 w-3.5 shrink-0 text-ink-300 dark:text-ink-500" aria-hidden="true" />}
                    {t(group.labelKey!)}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-ink-300 transition-transform duration-200 dark:text-ink-500",
                      "group-data-[state=open]:rotate-90",
                    )}
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content
                className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="space-y-0.5 border-l border-ink-100 py-0.5 pl-3 dark:border-ink-800">
                  {group.items.map((item) => (
                    <SidebarNavLink key={item.to} item={item} onNavigate={onNavigate} />
                  ))}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          );
        })}
      </AccordionPrimitive.Root>
    </nav>
  );
}

function SidebarNavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { to, labelKey, icon: Icon, end } = item;

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            : "text-ink-500 hover:bg-ink-50 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-brand-600 dark:text-brand-400" : "text-ink-400 group-hover/item:text-ink-600 dark:group-hover/item:text-ink-200",
            )}
          />
          {t(labelKey)}
        </>
      )}
    </NavLink>
  );
}
