import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Portfolio } from "../../../../../domain/entities/Portfolio";
import { ROUTES } from "../../../../../shared/constants/routes";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const { t } = useTranslation();
  return (
    <Link
      to={ROUTES.portfolioDetails(portfolio.id)}
      className="flex items-center gap-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 transition hover:border-brand-200 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Briefcase className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{portfolio.name}</p>
        <p className="truncate font-ledger text-xs text-ink-400 dark:text-ink-500">
          {t("investors.singular")} {portfolio.investorId.slice(0, 8)}…
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-ink-100 dark:bg-ink-800 px-2 py-0.5 font-ledger text-xs text-ink-500 dark:text-ink-400">
        {portfolio.currency}
      </span>
    </Link>
  );
}
