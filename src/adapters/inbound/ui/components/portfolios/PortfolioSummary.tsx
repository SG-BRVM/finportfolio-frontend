import type { Portfolio } from "../../../../../domain/entities/Portfolio";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { CashActions } from "./CashActions";

export function PortfolioSummary({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <dl className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Nom</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900">{portfolio.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Devise</dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700">{portfolio.currency}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Investisseur
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700">{portfolio.investorId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Créé le
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700">
              {formatDate(portfolio.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Capital disponible
          </dt>
          <dd className="mt-1 font-ledger text-lg font-semibold text-ink-900">
            {portfolio.cashBalance.format()}
          </dd>
        </div>
        <CashActions portfolio={portfolio} />
      </div>
    </div>
  );
}
