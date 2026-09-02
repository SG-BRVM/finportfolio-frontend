import { Link } from "react-router-dom";
import { User } from "lucide-react";
import type { Investor } from "../../../../../domain/entities/Investor";
import { ROUTES } from "../../../../../shared/constants/routes";
import { formatDateShort } from "../../../../../shared/utils/formatDate";

export function InvestorCard({ investor }: { investor: Investor }) {
  return (
    <Link
      to={ROUTES.investorDetails(investor.id)}
      className="flex items-center gap-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 transition hover:border-brand-200 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <User className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{investor.name}</p>
        <p className="truncate text-xs text-ink-400 dark:text-ink-500">{investor.email}</p>
      </div>
      <span className="shrink-0 font-ledger text-xs text-ink-300 dark:text-ink-600">
        {formatDateShort(investor.createdAt)}
      </span>
    </Link>
  );
}
