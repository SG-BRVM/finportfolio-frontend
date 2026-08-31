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
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  /** Identifiant stable utilisé comme value d'AccordionItem (sections repliables). */
  id: string;
  /** Omis pour la section de tête (Tableau de bord) : rendue en lien direct, hors accordéon. */
  label?: string;
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
 * Les groupes avec `label` sont rendus comme des sections repliables
 * (chaque section conserve son propre état ouvert/fermé - voir
 * SidebarNavigation).
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    items: [{ to: ROUTES.dashboard, label: "Tableau de bord", icon: LayoutDashboard, end: true }],
  },
  {
    id: "clients",
    label: "Clients",
    icon: Users,
    items: [{ to: ROUTES.investors, label: "Investisseurs", icon: Users }],
  },
  {
    id: "portfolio",
    label: "Portefeuille",
    icon: Wallet,
    items: [
      { to: ROUTES.portfolios, label: "Mes portefeuilles", icon: BriefcaseBusiness },
      { to: ROUTES.investments, label: "Mes investissements", icon: TrendingUp },
      { to: ROUTES.performance, label: "Performance", icon: ChartNoAxesCombined },
      { to: ROUTES.allocation, label: "Allocation", icon: PieChart },
      { to: ROUTES.risk, label: "Risque", icon: ShieldCheck },
    ],
  },
  {
    id: "operations",
    label: "Opérations",
    icon: ArrowLeftRight,
    items: [
      { to: ROUTES.orders, label: "Ordres", icon: ArrowLeftRight },
      { to: ROUTES.transactions, label: "Transactions", icon: Receipt },
    ],
  },
  {
    id: "markets",
    label: "Marchés",
    icon: Landmark,
    items: [
      { to: ROUTES.markets, label: "Marchés", icon: Landmark },
      { to: ROUTES.instruments, label: "Instruments", icon: LineChart },
    ],
  },
  {
    id: "planning",
    label: "Planification",
    icon: Compass,
    items: [
      { to: ROUTES.goals, label: "Objectifs", icon: Target },
      { to: ROUTES.advice, label: "Conseils", icon: Lightbulb },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageSquare,
    items: [
      { to: ROUTES.alerts, label: "Alertes", icon: Bell },
      { to: ROUTES.documents, label: "Documents", icon: FileText },
    ],
  },
  {
    id: "account",
    label: "Compte",
    icon: UserCog,
    items: [
      { to: ROUTES.security, label: "Sécurité", icon: Lock },
      { to: ROUTES.settings, label: "Paramètres", icon: Settings },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/**
 * getActiveGroupId - détermine quelle section repliable (NavGroup avec
 * label) contient la route courante, pour l'ouvrir automatiquement dans
 * la sidebar (y compris après un refresh, la section s'ouvre à nouveau
 * grâce à la route active - aucun état n'a besoin d'être persisté).
 * Retourne undefined pour le tableau de bord ou une route hors nav.
 */
export function getActiveGroupId(pathname: string): string | undefined {
  const group = NAV_GROUPS.find(
    (candidate) =>
      candidate.label && candidate.items.some((item) => item.to !== ROUTES.dashboard && pathname.startsWith(item.to)),
  );
  return group?.id;
}

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
