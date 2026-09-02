import type { HTMLAttributes } from "react";
import { cn } from "../../../../../shared/utils/cn";

/** Skeleton - placeholder de chargement. Ne jamais laisser une zone vide pendant un fetch. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-ink-100 dark:bg-ink-800", className)} {...props} />
  );
}
