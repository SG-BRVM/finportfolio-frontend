import type { Investor } from "../../../../../domain/entities/Investor";
import { formatDate } from "../../../../../shared/utils/formatDate";
import { Card, CardContent } from "../ui/card";

export function InvestorDetails({ investor }: { investor: Investor }) {
  return (
    <Card>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Nom</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900">{investor.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Email</dt>
            <dd className="mt-1 text-sm text-ink-700">{investor.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Client depuis
            </dt>
            <dd className="mt-1 font-ledger text-sm text-ink-700">
              {formatDate(investor.createdAt)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
