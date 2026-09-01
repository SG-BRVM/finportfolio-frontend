import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePortfolioValuation } from "../../hooks/usePortfolios";
import { MetricCard } from "./MetricCard";

export function PortfolioValuationCard({ portfolioId }: { portfolioId: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = usePortfolioValuation(portfolioId);
  return (
    <MetricCard
      label={t("portfolios.valuation")}
      value={isLoading || !data ? "…" : data.format()}
      icon={Wallet}
    />
  );
}
