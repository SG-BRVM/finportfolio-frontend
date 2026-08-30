import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn - fusionne des classes Tailwind conditionnelles sans collisions
 * (ex: "px-2" + "px-4" -> "px-4"). Convention standard shadcn/ui, utilisée
 * par tous les composants de components/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
