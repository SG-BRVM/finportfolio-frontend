/**
 * ROUTES - évite les chaînes magiques dispersées dans l'UI.
 *
 * Les routes marquées "placeholder" pointent vers des pages "Bientôt
 * disponible" (voir ComingSoonPage) : la navigation métier complète est
 * déjà en place (Sidebar/Topbar), mais leur contenu réel arrive dans une
 * phase ultérieure de la refonte. Elles ne touchent à aucun contrat API.
 */
export const ROUTES = {
  dashboard: "/",

  investors: "/investors",
  investorDetails: (id: string) => `/investors/${id}`,
  portfolios: "/portfolios",
  portfolioDetails: (id: string) => `/portfolios/${id}`,
  investments: "/investments",
  performance: "/performance",
  allocation: "/allocation",
  risk: "/risk",

  orders: "/orders",
  transactions: "/transactions",

  markets: "/markets",
  instruments: "/instruments",

  goals: "/goals",
  advice: "/advice",

  alerts: "/alerts",
  documents: "/documents",

  security: "/security",
  settings: "/settings",

  /** Route technique (health check) : conservée mais retirée de la navigation utilisateur (voir navigation.ts). */
  health: "/health",
} as const;
