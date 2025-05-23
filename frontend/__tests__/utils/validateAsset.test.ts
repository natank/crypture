import { describe, it, expect } from "vitest";
import { validateAsset } from "../../src/utils/validateAsset";

describe("validateAsset", () => {
  const validInput = {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 1,
  };

  it("returns valid: true for correct input", () => {
    const result = validateAsset(validInput);
    expect(result).toEqual({ valid: true });
  });

  it("returns error if asset is missing", () => {
    const result = validateAsset({
      quantity: 1,
    });

    expect(result.valid).toBe(false);

    if (result.valid === false) {
      expect(result.errors).toEqual([
        {
          field: "asset",
          message: "Please select a valid cryptocurrency.",
        },
      ]);
    }
  });

  it("returns error if quantity is not a number", () => {
    const result = validateAsset({
      ...validInput,
      quantity: NaN,
    });

    expect(result.valid).toBe(false);

    if (result.valid === false) {
      expect(result.errors).toEqual([
        {
          field: "quantity",
          message: "Quantity must be a number.",
        },
      ]);
    } else {
      throw new Error("Expected validation to fail");
    }
  });

  it("returns error if quantity is negative or zero", () => {
    const resultZero = validateAsset({ ...validInput, quantity: 0 });
    const resultNegative = validateAsset({ ...validInput, quantity: -5 });

    expect(resultZero.valid).toBe(false);
    if (resultZero.valid === false) {
      expect(resultZero.errors[0].message).toMatch(/greater than zero/);
    } else {
      throw new Error("Expected validation to fail");
    }
    expect(resultNegative.valid).toBe(false);
    if (resultNegative.valid === false) {
      expect(resultNegative.errors[0].message).toMatch(/greater than zero/);
    } else {
      throw new Error("Expected validation to fail");
    }
  });

  it("returns both asset and quantity errors when both invalid", () => {
    const result = validateAsset({ quantity: 0 });

    expect(result.valid).toBe(false);
    if (result.valid === false) {
      expect(result.errors.length).toBe(2);
    } else {
      throw new Error("Expected validation to fail");
    }
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "asset" }),
        expect.objectContaining({ field: "quantity" }),
      ])
    );
  });
});
