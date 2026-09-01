import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./infrastructure/query/queryClient";
import { AppRoutes } from "./adapters/inbound/ui/routes/AppRoutes";
import { TooltipProvider } from "./adapters/inbound/ui/components/ui/tooltip";

/**
 * App - composition racine. React Router, TanStack Query et le
 * TooltipProvider Radix sont montés ici, à la frontière de l'Adapter
 * Inbound UI ; ils ne fuient jamais vers Application ou Domain.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
