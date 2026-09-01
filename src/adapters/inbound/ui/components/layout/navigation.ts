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
  Wallet,
  Compass,
  MessageSquare,
  UserCog,
} from "lucide-react";
import { ROUTES } from "../../../../../shared/constants/routes";

export interface NavItem {
  to: string;
  /** Clé de traduction (namespace "nav.*"), résolue avec t() par les consommateurs. */
  labelKey: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  /** Identifiant stable utilisé comme value d'AccordionItem (sections repliables). */
  id: string;
  /** Omis pour la section de tête (Tableau de bord) : rendue en lien direct, hors accordéon. */
  labelKey?: string;
  /** Icône affichée devant le titre de la section (groupes repliables uniquement). */
  icon?: LucideIcon;
  items: NavItem[];
}

/**
 * NAV_GROUPS - source unique de la navigation métier, partagée par le
 * Sidebar desktop et le MobileNav (Sheet).
 *
 * Le vocabulaire et le regroupement suivent l'usage du client (Clients,
 * Portefeuille, Opérations, Marchés, Planification, Communication, Compte)
 * plutôt que les entités techniques de l'API. Seul l'écran purement
 * technique de santé applicative (health check) reste accessible par sa
 * route sans apparaître ici - voir ROUTES.health.
 *
 * Les groupes avec `labelKey` sont rendus comme des sections repliables
 * (chaque section conserve son propre état ouvert/fermé - voir
 * SidebarNavigation).
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    items: [{ to: ROUTES.dashboard, labelKey: "nav.dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    id: "clients",
    labelKey: "nav.groups.clients",
    icon: Users,
    items: [{ to: ROUTES.investors, labelKey: "nav.investors", icon: Users }],
  },
  {
    id: "portfolio",
    labelKey: "nav.groups.portfolio",
    icon: Wallet,
    items: [
      { to: ROUTES.portfolios, labelKey: "nav.portfolios", icon: BriefcaseBusiness },
      { to: ROUTES.investments, labelKey: "nav.investments", icon: TrendingUp },
      { to: ROUTES.performance, labelKey: "nav.performance", icon: ChartNoAxesCombined },
      { to: ROUTES.allocation, labelKey: "nav.allocation", icon: PieChart },
      { to: ROUTES.risk, labelKey: "nav.risk", icon: ShieldCheck },
    ],
  },
  {
    id: "operations",
    labelKey: "nav.groups.operations",
    icon: ArrowLeftRight,
    items: [
      { to: ROUTES.orders, labelKey: "nav.orders", icon: ArrowLeftRight },
      { to: ROUTES.transactions, labelKey: "nav.transactions", icon: Receipt },
    ],
  },
  {
    id: "markets",
    labelKey: "nav.groups.markets",
    icon: Landmark,
    items: [
      { to: ROUTES.markets, labelKey: "nav.markets", icon: Landmark },
      { to: ROUTES.instruments, labelKey: "nav.instruments", icon: LineChart },
    ],
  },
  {
    id: "planning",
    labelKey: "nav.groups.planning",
    icon: Compass,
    items: [
      { to: ROUTES.goals, labelKey: "nav.goals", icon: Target },
      { to: ROUTES.advice, labelKey: "nav.advice", icon: Lightbulb },
    ],
  },
  {
    id: "communication",
    labelKey: "nav.groups.communication",
    icon: MessageSquare,
    items: [
      { to: ROUTES.alerts, labelKey: "nav.alerts", icon: Bell },
      { to: ROUTES.documents, labelKey: "nav.documents", icon: FileText },
    ],
  },
  {
    id: "account",
    labelKey: "nav.groups.account",
    icon: UserCog,
    items: [
      { to: ROUTES.security, labelKey: "nav.security", icon: Lock },
      { to: ROUTES.settings, labelKey: "nav.settings", icon: Settings },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/**
 * getActiveGroupId - détermine quelle section repliable (NavGroup avec
 * labelKey) contient la route courante, pour l'ouvrir automatiquement dans
 * la sidebar (y compris après un refresh, la section s'ouvre à nouveau
 * grâce à la route active - aucun état n'a besoin d'être persisté).
 * Retourne undefined pour le tableau de bord ou une route hors nav.
 */
export function getActiveGroupId(pathname: string): string | undefined {
  const group = NAV_GROUPS.find(
    (candidate) =>
      candidate.labelKey && candidate.items.some((item) => item.to !== ROUTES.dashboard && pathname.startsWith(item.to)),
  );
  return group?.id;
}

export interface BreadcrumbCrumb {
  labelKey: string;
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
    return [{ labelKey: "nav.dashboard" }];
  }

  const item = NAV_ITEMS.find((candidate) => candidate.to !== ROUTES.dashboard && pathname.startsWith(candidate.to));
  if (!item) {
    return [{ labelKey: "common.appName" }];
  }

  if (pathname === item.to) {
    return [{ labelKey: item.labelKey }];
  }

  return [
    { labelKey: item.labelKey, to: item.to },
    { labelKey: "common.detail" },
  ];
}
