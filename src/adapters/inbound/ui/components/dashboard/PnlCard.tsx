import { TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolioPnl } from "../../hooks/usePortfolios";
import { MetricCard } from "./MetricCard";

export function PnlCard({ portfolioId }: { portfolioId: string }) {
  const { data, isLoading } = usePortfolioPnl(portfolioId);
  const isNegative = data?.isNegative() ?? false;
  return (
    <MetricCard
      label="Profit & Loss"
      value={isLoading || !data ? "…" : data.format()}
      icon={isNegative ? TrendingDown : TrendingUp}
      tone={isLoading || !data ? "neutral" : isNegative ? "negative" : "positive"}
    />
  );
}
