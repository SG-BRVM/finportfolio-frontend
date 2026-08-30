import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../../../../shared/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800",
        "placeholder:text-ink-400",
        "focus:border-brand-400 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
