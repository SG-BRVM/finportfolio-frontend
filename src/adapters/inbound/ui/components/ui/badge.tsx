import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../../shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      variant: {
        neutral: "bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 ring-ink-200",
        brand: "bg-brand-50 text-brand-700 ring-brand-100",
        success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        warning: "bg-amber-50 text-amber-700 ring-amber-200",
        destructive: "bg-rose-50 text-rose-700 ring-rose-200",
        violet: "bg-violet-50 text-violet-700 ring-violet-200",
        teal: "bg-teal-50 text-teal-700 ring-teal-200",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/** Badge - étiquette de statut réutilisable (variantes financières: succès/attente/erreur/type). */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
