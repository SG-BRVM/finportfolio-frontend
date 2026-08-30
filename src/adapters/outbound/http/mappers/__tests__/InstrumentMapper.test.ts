import { describe, it, expect } from "vitest";
import { InstrumentMapper } from "../InstrumentMapper";

describe("InstrumentMapper", () => {
  it("convertit la réponse snake_case du backend en entité Domain camelCase", () => {
    const instrument = InstrumentMapper.toDomain({
      id: "instr-1",
      symbol: "SNTS",
      name: "Sonatel",
      instrument_type: "STOCK",
      currency: "XOF",
      current_price: "12500",
      nominal_value: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    expect(instrument.instrumentType).toBe("STOCK");
    expect(instrument.currentPrice.format()).toBe("12 500 XOF");
    expect(instrument.nominalValue).toBeNull();
  });

  it("convertit la valeur nominale quand le backend en renvoie une", () => {
    const instrument = InstrumentMapper.toDomain({
      id: "instr-1",
      symbol: "SNTS",
      name: "Sonatel",
      instrument_type: "STOCK",
      currency: "XOF",
      current_price: "12500",
      nominal_value: "10000",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
    });

    expect(instrument.nominalValue?.format()).toBe("10 000 XOF");
  });
});
