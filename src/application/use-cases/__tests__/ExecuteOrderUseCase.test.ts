import { describe, it, expect } from "vitest";
import { CreateOrderUseCase } from "../orders/CreateOrderUseCase";
import { ExecuteOrderUseCase } from "../orders/ExecuteOrderUseCase";
import { FakeOrderRepository } from "./fakes/FakeOrderRepository";

describe("ExecuteOrderUseCase", () => {
  it("exécute un ordre PENDING sans React, Axios ni API réelle", async () => {
    const repository = new FakeOrderRepository();
    const createOrder = new CreateOrderUseCase(repository);
    const executeOrder = new ExecuteOrderUseCase(repository);

    const order = await createOrder.execute({
      portfolioId: "portfolio-1",
      instrumentId: "instrument-1",
      side: "BUY",
      quantity: "10",
      price: "100",
    });

    const transaction = await executeOrder.execute(order.id);

    expect(transaction.orderId).toBe(order.id);
    expect(transaction.side).toBe("BUY");

    const refreshed = await repository.getById(order.id);
    expect(refreshed.status).toBe("EXECUTED");
  });
});
