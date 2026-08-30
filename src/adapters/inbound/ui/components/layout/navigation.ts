import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  TrendingUp,
  ChartNoAxesCombined,
  PieChart,
  ShieldCheck,
  ArrowLeftRight,
  Receipt,
  Landmark,
  LineChart,
  Target,
  Lightbulb,
  Bell,
  FileText,
  Lock,
  Settings,
} from "lucide-react";
import { ROUTES } from "../../../../../shared/constants/routes";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  /** Omis pour la section de tête (Tableau de bord) : pas d'en-tête affiché. */
  label?: string;
  items: NavItem[];
}

/**
 * NAV_GROUPS - source unique de la navigation métier, partagée par le
 * Sidebar desktop et le MobileNav (Sheet).
 *
 * Le vocabulaire et le regroupement suivent l'usage du client (Clients,
 * Portfolio, Opérations, Marchés, Planification, Communication, Compte)
 * plutôt que les entités techniques de l'API. Seul l'écran purement
 * technique de santé applicative (health check) reste accessible par sa
 * route sans apparaître ici - voir ROUTES.health.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: ROUTES.dashboard, label: "Tableau de bord", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Clients",
    items: [{ to: ROUTES.investors, label: "Investisseurs", icon: Users }],
  },
  {
    label: "Portfolio",
    items: [
      { to: ROUTES.portfolios, label: "Mes portefeuilles", icon: BriefcaseBusiness },
      { to: ROUTES.investments, label: "Mes investissements", icon: TrendingUp },
      { to: ROUTES.performance, label: "Performance", icon: ChartNoAxesCombined },
      { to: ROUTES.allocation, label: "Allocation", icon: PieChart },
      { to: ROUTES.risk, label: "Risque", icon: ShieldCheck },
    ],
  },
  {
    label: "Opérations",
    items: [
      { to: ROUTES.orders, label: "Ordres", icon: ArrowLeftRight },
      { to: ROUTES.transactions, label: "Transactions", icon: Receipt },
    ],
  },
  {
    label: "Marchés",
    items: [
      { to: ROUTES.markets, label: "Marchés", icon: Landmark },
      { to: ROUTES.instruments, label: "Instruments", icon: LineChart },
    ],
  },
  {
    label: "Planification",
    items: [
      { to: ROUTES.goals, label: "Objectifs", icon: Target },
      { to: ROUTES.advice, label: "Conseils", icon: Lightbulb },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: ROUTES.alerts, label: "Alertes", icon: Bell },
      { to: ROUTES.documents, label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Compte",
    items: [
      { to: ROUTES.security, label: "Sécurité", icon: Lock },
      { to: ROUTES.settings, label: "Paramètres", icon: Settings },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export interface BreadcrumbCrumb {
  label: string;
  to?: string;
}

/**
 * getBreadcrumbTrail - dérive le fil d'Ariane du Topbar à partir du
 * pathname courant, sans dupliquer les libellés déjà définis dans
 * NAV_ITEMS. Les routes de détail (/portfolios/:id...) ajoutent un
 * segment "Détail" après l'item de nav parent. Les routes hors nav
 * (investisseurs, health) retombent sur un libellé générique.
 */
export function getBreadcrumbTrail(pathname: string): BreadcrumbCrumb[] {
  if (pathname === ROUTES.dashboard) {
    return [{ label: "Tableau de bord" }];
  }

  const item = NAV_ITEMS.find((candidate) => candidate.to !== ROUTES.dashboard && pathname.startsWith(candidate.to));
  if (!item) {
    return [{ label: "FinPortfolio" }];
  }

  if (pathname === item.to) {
    return [{ label: item.label }];
  }

  return [
    { label: item.label, to: item.to },
    { label: "Détail" },
  ];
}
