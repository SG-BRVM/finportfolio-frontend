import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePortfolioPnl } from "../../hooks/usePortfolios";
import { MetricCard } from "./MetricCard";

export function PnlCard({ portfolioId }: { portfolioId: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = usePortfolioPnl(portfolioId);
  const isNegative = data?.isNegative() ?? false;
  return (
    <MetricCard
      label={t("portfolios.pnl")}
      value={isLoading || !data ? "…" : data.format()}
      icon={isNegative ? TrendingDown : TrendingUp}
      tone={isLoading || !data ? "neutral" : isNegative ? "negative" : "positive"}
    />
  );
}
