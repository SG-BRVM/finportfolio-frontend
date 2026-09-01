import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../components/layout/AppLayout";
import { ROUTES } from "../../../../shared/constants/routes";
import { DashboardPage } from "../pages/DashboardPage";
import { InvestorsPage } from "../pages/InvestorsPage";
import { InvestorDetailsPage } from "../pages/InvestorDetailsPage";
import { PortfoliosPage } from "../pages/PortfoliosPage";
import { PortfolioDetailsPage } from "../pages/PortfolioDetailsPage";
import { InstrumentsPage } from "../pages/InstrumentsPage";
import { OrdersPage } from "../pages/OrdersPage";
import { HealthPage } from "../pages/HealthPage";
import { ComingSoonPage } from "../pages/ComingSoonPage";
import { InvestmentsPage } from "../pages/InvestmentsPage";
import { PerformancePage } from "../pages/PerformancePage";
import { AllocationPage } from "../pages/AllocationPage";
import { RiskPage } from "../pages/RiskPage";
import { MarketsPage } from "../pages/MarketsPage";
import { GoalsPage } from "../pages/GoalsPage";
import { AdvicePage } from "../pages/AdvicePage";
import { AlertsPage } from "../pages/AlertsPage";
import { DocumentsPage } from "../pages/DocumentsPage";

/**
 * AppRoutes - table de routage.
 *
 * Les routes ci-dessous marquées ComingSoonPage correspondent aux entrées
 * de la navigation métier (voir components/layout/navigation.ts) dont la
 * refonte fonctionnelle arrive dans une phase ultérieure : la nav est
 * déjà complète, seul le contenu de la page reste à construire.
 * Restent dans ce cas : Paramètres, Sécurité (aucun système
 * d'authentification n'existe côté backend - voir app/domain -, l'ancien
 * contenu mocké de SecurityPage.tsx a été retiré).
 *
 * /investors et /health restent fonctionnelles mais ne sont plus liées
 * depuis la navigation utilisateur (écrans techniques/CRUD, voir
 * navigation.ts).
 */
export function AppRoutes() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />

        <Route path={ROUTES.investors} element={<InvestorsPage />} />
        <Route path="/investors/:id" element={<InvestorDetailsPage />} />
        <Route path={ROUTES.portfolios} element={<PortfoliosPage />} />
        <Route path="/portfolios/:id" element={<PortfolioDetailsPage />} />
        <Route path={ROUTES.investments} element={<InvestmentsPage />} />
        <Route path={ROUTES.performance} element={<PerformancePage />} />
        <Route path={ROUTES.allocation} element={<AllocationPage />} />
        <Route path={ROUTES.risk} element={<RiskPage />} />

        <Route path={ROUTES.orders} element={<OrdersPage />} />
        <Route path={ROUTES.transactions} element={<OrdersPage />} />

        <Route path={ROUTES.markets} element={<MarketsPage />} />
        <Route path={ROUTES.instruments} element={<InstrumentsPage />} />

        <Route path={ROUTES.goals} element={<GoalsPage />} />
        <Route path={ROUTES.advice} element={<AdvicePage />} />

        <Route path={ROUTES.alerts} element={<AlertsPage />} />
        <Route path={ROUTES.documents} element={<DocumentsPage />} />

        <Route
          path={ROUTES.security}
          element={
            <ComingSoonPage
              title={t("nav.security")}
              description={t("comingSoon.securityDescription")}
            />
          }
        />
        <Route
          path={ROUTES.settings}
          element={
            <ComingSoonPage
              title={t("nav.settings")}
              description={t("comingSoon.settingsDescription")}
            />
          }
        />

        <Route path={ROUTES.health} element={<HealthPage />} />

        <Route
          path="*"
          element={
            <ComingSoonPage
              title={t("notFound.title", "Page introuvable")}
              description={t(
                "notFound.description",
                "Cette page n'existe pas ou n'est pas encore disponible."
              )}
            />
          }
        />
      </Route>
    </Routes>
  );
}
