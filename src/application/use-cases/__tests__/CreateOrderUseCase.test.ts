import { describe, it, expect } from "vitest";
import { CreateOrderUseCase } from "../orders/CreateOrderUseCase";
import { CancelOrderUseCase } from "../orders/CancelOrderUseCase";
import { FakeOrderRepository } from "./fakes/FakeOrderRepository";

describe("CreateOrderUseCase / CancelOrderUseCase", () => {
  it("crée un ordre PENDING puis peut l'annuler", async () => {
    const repository = new FakeOrderRepository();
    const createOrder = new CreateOrderUseCase(repository);
    const cancelOrder = new CancelOrderUseCase(repository);

    const order = await createOrder.execute({
      portfolioId: "portfolio-1",
      instrumentId: "instrument-1",
      side: "SELL",
      quantity: "5",
      price: "200",
    });
    expect(order.status).toBe("PENDING");

    const cancelled = await cancelOrder.execute(order.id);
    expect(cancelled.status).toBe("CANCELLED");
  });
});
