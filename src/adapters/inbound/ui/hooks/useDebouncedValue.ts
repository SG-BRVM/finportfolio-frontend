import { useEffect, useState } from "react";

/** useDebouncedValue - retourne `value` avec un délai, pour éviter de
 * lancer une requête d'autocomplétion à chaque frappe clavier. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
