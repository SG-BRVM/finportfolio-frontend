import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../../../../shared/utils/cn";

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
