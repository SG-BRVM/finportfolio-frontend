import type { Portfolio } from "../../../../../domain/entities/Portfolio";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { CashActions } from "./CashActions";

export function PortfolioSummary({ portfolio }: { portfolio: Portfolio }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <dl className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{t("common.name")}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900 dark:text-ink-50">{portfolio.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{t("common.currency")}</dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700 dark:text-ink-200">{portfolio.currency}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
              {t("investors.singular")}
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700 dark:text-ink-200">{portfolio.investorId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
              {t("common.createdOn")}
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700 dark:text-ink-200">
              {formatDate(portfolio.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-ink-100 dark:border-ink-800 pt-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
            {t("portfolios.availableCapital")}
          </dt>
          <dd className="mt-1 font-ledger text-lg font-semibold text-ink-900 dark:text-ink-50">
            {portfolio.cashBalance.format()}
          </dd>
        </div>
        <CashActions portfolio={portfolio} />
      </div>
    </div>
  );
}
