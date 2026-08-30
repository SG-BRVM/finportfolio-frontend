import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { PortfolioHeroCard } from "../components/dashboard/PortfolioHeroCard";
import {
  PerformanceOverviewCard,
  LiquidityOverviewCard,
  RiskOverviewCard,
} from "../components/dashboard/DashboardOverviewCards";
import { PortfolioPositionsTable } from "../components/portfolios/PortfolioPositionsTable";
import { PortfolioOrdersTable } from "../components/portfolios/PortfolioOrdersTable";
import { EmptyState } from "../components/common/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { usePortfolios, usePortfolioPositions, usePortfolioOrders } from "../hooks/usePortfolios";
import { usePortfolioOverview } from "../hooks/usePortfolioOverview";
import { useInstruments } from "../hooks/useInstruments";
import { getPortfolioRiskProfile } from "../../../../mocks/risk";
import { CURRENT_USER } from "../../../../mocks/user";
import { ROUTES } from "../../../../shared/constants/routes";

/**
 * DashboardPage - vue d'ensemble patrimoniale. Met en avant la valeur
 * totale et la performance du portefeuille "sélectionné" parmi ceux
 * connus dans la session (le backend n'exposant pas de portefeuille "par
 * défaut" global), puis le détail de ses positions et derniers ordres.
 */
export function DashboardPage() {
  const firstName = CURRENT_USER.name.split(" ")[0];

  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();
  const { data: instruments = [] } = useInstruments();

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedPortfolioId && portfolios.length > 0) {
      setSelectedPortfolioId(portfolios[0]?.id);
    }
  }, [portfolios, selectedPortfolioId]);

  const selectedPortfolio = portfolios.find((p) => p?.id === selectedPortfolioId);
  const { data: positions = [] } = usePortfolioPositions(selectedPortfolioId);
  const { data: orders = [] } = usePortfolioOrders(selectedPortfolioId);
  const overview = usePortfolioOverview(selectedPortfolio);
  const riskProfile = selectedPortfolioId ? getPortfolioRiskProfile(selectedPortfolioId) : null;

  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));
  const recentOrders = orders.slice(0, 5);

  return (
    <PageContainer
      title={`Bonjour, ${firstName}`}
      description="Voici un aperçu de votre situation financière."
      actions={
        portfolios.length > 0 && (
          <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Choisir un portefeuille" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    >
      {!arePortfoliosLoading && portfolios.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun portefeuille à afficher"
          description="Créez un investisseur puis un portefeuille pour voir sa valorisation, sa performance et son niveau de risque ici."
          action={
            <Link
              to={ROUTES.portfolios}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Créer un portefeuille
            </Link>
          }
        />
      ) : (
        selectedPortfolio && (
          <div className="space-y-6">
            <PortfolioHeroCard
              portfolioName={selectedPortfolio.name}
              totalValue={overview.totalValue ?? null}
              performancePercentage={overview.performancePercentage}
              isLoading={overview.isLoading}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PerformanceOverviewCard
                pnl={overview.pnl ?? null}
                performancePercentage={overview.performancePercentage}
                isLoading={overview.isLoading}
              />
              <LiquidityOverviewCard
                cashBalance={overview.cashBalance ?? null}
                shareOfTotalPercentage={overview.liquidityPercentage}
                isLoading={overview.isLoading}
              />
              <RiskOverviewCard riskProfile={riskProfile} />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to={ROUTES.portfolioDetails(selectedPortfolio.id)}
                className="text-sm font-medium text-brand-600 hover:underline"
              >
                Voir le détail du portefeuille
              </Link>
            </div>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
                Positions principales
              </h2>
              <PortfolioPositionsTable positions={positions} instruments={instrumentsById} />
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
                Derniers ordres
              </h2>
              <PortfolioOrdersTable orders={recentOrders} />
            </section>
          </div>
        )
      )}
    </PageContainer>
  );
}
