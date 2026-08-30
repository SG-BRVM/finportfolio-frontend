import { useState } from "react";
import { Bell, TrendingUp, ShieldAlert, ArrowLeftRight, Landmark, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EmptyState } from "../components/common/EmptyState";
import {
  NOTIFICATIONS_PREVIEW,
  NOTIFICATION_CATEGORY_LABELS,
  type NotificationCategory,
} from "../../../../mocks/notifications";

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  performance: TrendingUp,
  risk: ShieldAlert,
  orders: ArrowLeftRight,
  markets: Landmark,
  security: Lock,
};

const CATEGORIES: NotificationCategory[] = ["performance", "risk", "orders", "markets", "security"];

/**
 * AlertsPage - "Alertes", catégorisées (performance, risque, ordres,
 * marchés, sécurité). Le contenu vient de mocks/notifications.ts : aucun
 * endpoint d'alertes n'existe côté API.
 */
export function AlertsPage() {
  const [category, setCategory] = useState<NotificationCategory | "all">("all");

  const filtered =
    category === "all"
      ? NOTIFICATIONS_PREVIEW
      : NOTIFICATIONS_PREVIEW.filter((n) => n.category === category);

  return (
    <PageContainer title="Alertes" description="Les événements importants sur votre patrimoine.">
      <Tabs value={category} onValueChange={(v) => setCategory(v as NotificationCategory | "all")}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {NOTIFICATION_CATEGORY_LABELS[c]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={category}>
          {filtered.length === 0 ? (
            <EmptyState icon={Bell} title="Aucune alerte" description="Aucune alerte dans cette catégorie." />
          ) : (
            <div className="space-y-3">
              {filtered.map((notification) => {
                const Icon = CATEGORY_ICONS[notification.category];
                return (
                  <Alert
                    key={notification.id}
                    variant={notification.severity === "warning" ? "warning" : "default"}
                  >
                    <Icon />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertTitle>{notification.title}</AlertTitle>
                        <Badge variant="neutral" className="ml-auto">
                          {NOTIFICATION_CATEGORY_LABELS[notification.category]}
                        </Badge>
                      </div>
                      <AlertDescription>{notification.description}</AlertDescription>
                    </div>
                  </Alert>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
