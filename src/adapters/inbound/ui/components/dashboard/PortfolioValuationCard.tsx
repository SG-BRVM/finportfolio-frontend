import { Wallet } from "lucide-react";
import { usePortfolioValuation } from "../../hooks/usePortfolios";
import { MetricCard } from "./MetricCard";

export function PortfolioValuationCard({ portfolioId }: { portfolioId: string }) {
  const { data, isLoading } = usePortfolioValuation(portfolioId);
  return (
    <MetricCard
      label="Valorisation"
      value={isLoading || !data ? "…" : data.format()}
      icon={Wallet}
    />
  );
}
