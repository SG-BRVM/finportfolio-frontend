import { Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { AddGoalDialog } from "../components/goals/AddGoalDialog";
import { useGoals } from "../hooks/useGoals";
import { formatNumber } from "../../../../shared/utils/formatNumber";

/**
 * GoalsPage - "Mes objectifs". Les objectifs sont persistés côté backend
 * (voir hooks/useGoals.ts, GET/POST /api/v1/goals).
 */
export function GoalsPage() {
  const { t } = useTranslation();
  const { data: goals = [], isLoading } = useGoals();

  return (
    <PageContainer
      title={t("nav.goals")}
      description={t("goals.pageDescription")}
      actions={<AddGoalDialog />}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={t("goals.emptyTitle")}
          description={t("goals.emptyDescription")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const percentage =
              goal.targetAmount > 0
                ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
                : 0;
            const formatMoney = (amount: number) =>
              `${formatNumber(amount)} ${goal.currency}`;

            return (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4 text-brand-600" />
                    {goal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-ledger text-sm text-ink-500">
                    {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}
                  </p>
                  <Progress value={percentage} tone="brand" className="mt-3" />
                  <p className="mt-1.5 text-right text-xs font-medium text-ink-400">
                    {Math.round(percentage)} %
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
