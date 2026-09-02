import type { Investor } from "../../../../../domain/entities/Investor";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";

export function InvestorDetails({ investor }: { investor: Investor }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{t("common.name")}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900 dark:text-ink-50">{investor.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{t("common.email")}</dt>
            <dd className="mt-1 text-sm text-ink-700 dark:text-ink-200">{investor.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
              {t("investors.clientSince")}
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700 dark:text-ink-200">
              {formatDate(investor.createdAt)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
