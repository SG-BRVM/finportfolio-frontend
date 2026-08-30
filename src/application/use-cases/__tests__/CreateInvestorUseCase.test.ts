import { describe, it, expect } from "vitest";
import { CreateInvestorUseCase } from "../investors/CreateInvestorUseCase";
import { FakeInvestorRepository } from "./fakes/FakeInvestorRepository";

describe("CreateInvestorUseCase", () => {
  it("délègue la création au repository et retourne l'investisseur créé", async () => {
    const repository = new FakeInvestorRepository();
    const useCase = new CreateInvestorUseCase(repository);

    const investor = await useCase.execute({ name: "Adama Coulibaly", email: "adama@example.com" });

    expect(investor.name).toBe("Adama Coulibaly");
    expect(repository.created).toHaveLength(1);
  });
});
