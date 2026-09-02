import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../../../../shared/utils/cn";
import { buttonVariants } from "./button-variants";

export function Pagination({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentPropsWithoutRef<"ul">) {
  return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

export function PaginationItem({ className, ...props }: ComponentPropsWithoutRef<"li">) {
  return <li className={cn("", className)} {...props} />;
}

interface PaginationLinkProps extends ComponentPropsWithoutRef<"button"> {
  isActive?: boolean;
}

export function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "outline", size: "icon" }),
        "h-8 w-8",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      aria-label="Page précédente"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      Précédent
    </button>
  );
}

export function PaginationNext({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      aria-label="Page suivante"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 pr-2.5", className)}
      {...props}
    >
      Suivant
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex h-8 w-8 items-center justify-center text-ink-400 dark:text-ink-500", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Pages supplémentaires</span>
    </span>
  );
}
