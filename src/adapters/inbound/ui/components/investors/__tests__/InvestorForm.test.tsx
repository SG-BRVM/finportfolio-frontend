import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvestorForm } from "../InvestorForm";

// On mocke le container DI : le test de composant UI ne doit jamais
// toucher Axios ni un backend réel, seulement vérifier que le Use Case
// est bien appelé avec les bonnes données issues du formulaire.
vi.mock("../../../../../../infrastructure/di/container", () => ({
  container: {
    useCases: {
      investors: {
        create: { execute: vi.fn() },
      },
    },
  },
}));

import { container } from "../../../../../../infrastructure/di/container";

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("InvestorForm", () => {
  beforeEach(() => {
    vi.mocked(container.useCases.investors.create.execute).mockReset();
  });

  it("appelle CreateInvestorUseCase avec les données saisies", async () => {
    const user = userEvent.setup();
    vi.mocked(container.useCases.investors.create.execute).mockResolvedValue({
      id: "investor-1",
      name: "Adama Coulibaly",
      email: "adama@example.com",
      createdAt: new Date(),
    });

    renderWithClient(<InvestorForm />);

    await user.type(screen.getByPlaceholderText("Adama Coulibaly"), "Adama Coulibaly");
    await user.type(screen.getByPlaceholderText("adama@example.com"), "adama@example.com");
    await user.click(screen.getByRole("button", { name: /créer l'investisseur/i }));

    await waitFor(() => {
      expect(container.useCases.investors.create.execute).toHaveBeenCalledWith({
        name: "Adama Coulibaly",
        email: "adama@example.com",
      });
    });
  });

  it("affiche une erreur de validation si l'email est invalide", async () => {
    const user = userEvent.setup();
    renderWithClient(<InvestorForm />);

    await user.type(screen.getByPlaceholderText("Adama Coulibaly"), "Adama");
    await user.type(screen.getByPlaceholderText("adama@example.com"), "pas-un-email");
    await user.click(screen.getByRole("button", { name: /créer l'investisseur/i }));

    expect(await screen.findByText("Adresse email invalide.")).toBeInTheDocument();
    expect(container.useCases.investors.create.execute).not.toHaveBeenCalled();
  });
});
