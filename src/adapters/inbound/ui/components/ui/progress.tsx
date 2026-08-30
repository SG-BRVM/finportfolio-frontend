import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../../shared/utils/cn";

const progressIndicatorVariants = cva("h-full w-full flex-1 rounded-full transition-all", {
  variants: {
    tone: {
      brand: "bg-brand-600",
      success: "bg-emerald-600",
      warning: "bg-amber-500",
      destructive: "bg-rose-600",
    },
  },
  defaultVariants: { tone: "brand" },
});

export interface ProgressProps
  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressIndicatorVariants> {
  value?: number;
}

/** Progress - jauge de progression (score de risque, avancement d'un objectif). */
export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, tone, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-ink-100", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ tone }))}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;
