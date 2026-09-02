import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

/** EmptyState - invite à agir lorsqu'aucune donnée n'est encore disponible. */
export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-6 py-14 text-center">
      <Icon className="mb-1 h-8 w-8 text-ink-300 dark:text-ink-600" />
      <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-400 dark:text-ink-500">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
