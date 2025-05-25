import { validateAsset } from "@utils/validateAsset";
import { describe, it, expect } from "vitest";

describe("validateAsset", () => {
  const validInput = {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 1,
  };

  it("returns valid: true for correct input", () => {
    const result = validateAsset(validInput);
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it("returns multiple errors if asset fields are missing", () => {
    const result = validateAsset({
      quantity: 1,
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "id" }),
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "symbol" }),
        ])
      );
    }
  });

  it("returns error if quantity is not a number", () => {
    const result = validateAsset({
      ...validInput,
      quantity: NaN,
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toEqual([
        {
          field: "quantity",
          message: "Quantity must be a number.",
        },
      ]);
    }
  });

  it("returns error if quantity is negative or zero", () => {
    const resultZero = validateAsset({ ...validInput, quantity: 0 });
    const resultNegative = validateAsset({ ...validInput, quantity: -5 });

    [resultZero, resultNegative].forEach((res) => {
      expect(res.valid).toBe(false);
      if (!res.valid) {
        expect(res.errors[0].message).toMatch(/positive number/);
      }
    });
  });

  it("returns multiple errors when asset fields and quantity are invalid", () => {
    const result = validateAsset({ quantity: 0 });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "id" }),
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "symbol" }),
          expect.objectContaining({ field: "quantity" }),
        ])
      );
    }
  });
});
