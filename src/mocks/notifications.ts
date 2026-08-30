// TEMPORARY MOCK DATA
// Il n'existe pas encore d'endpoint d'alertes côté API. Ce module nourrit
// l'aperçu affiché dans le Topbar ainsi que la page "Alertes" ; il sera
// remplacé par un hook useAlerts() branché sur un futur Port/Use Case dès
// que l'endpoint existera. Isolé ici pour ne jamais mélanger de données
// mockées directement dans les composants UI.

export type NotificationCategory = "performance" | "risk" | "orders" | "markets" | "security";

export type NotificationSeverity = "info" | "warning";

export interface NotificationPreview {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  description: string;
}

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  performance: "Performance",
  risk: "Risque",
  orders: "Ordres",
  markets: "Marchés",
  security: "Sécurité",
};

export const NOTIFICATIONS_PREVIEW: NotificationPreview[] = [
  {
    id: "n1",
    category: "orders",
    severity: "info",
    title: "Ordre exécuté",
    description: "Votre ordre SONATEL a été exécuté.",
  },
  {
    id: "n2",
    category: "performance",
    severity: "info",
    title: "Variation importante",
    description: "Votre portefeuille a évolué de plus de 2 % aujourd'hui.",
  },
  {
    id: "n3",
    category: "risk",
    severity: "warning",
    title: "Concentration sectorielle",
    description: "Votre exposition au secteur financier dépasse votre seuil habituel.",
  },
  {
    id: "n4",
    category: "markets",
    severity: "info",
    title: "Cours rafraîchis",
    description: "Les derniers cours de clôture BRVM ont été appliqués à vos instruments suivis.",
  },
  {
    id: "n5",
    category: "security",
    severity: "warning",
    title: "Nouvelle connexion détectée",
    description: "Une connexion depuis un nouvel appareil a été enregistrée.",
  },
  {
    id: "n6",
    category: "orders",
    severity: "info",
    title: "Ordre en attente",
    description: "Votre ordre BOA est en attente d'exécution.",
  },
];
