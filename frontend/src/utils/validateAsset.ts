import type { PortfolioAsset } from "../hooks/usePortfolio";

type ValidationResult =
  | { valid: true }
  | { valid: false; errors: { field: string; message: string }[] };

export function validateAsset(
  input: Partial<PortfolioAsset>
): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  if (!input.id || !input.name || !input.symbol) {
    errors.push({
      field: "asset",
      message: "Please select a valid cryptocurrency.",
    });
  }

  if (typeof input.quantity !== "number" || isNaN(input.quantity)) {
    errors.push({
      field: "quantity",
      message: "Quantity must be a number.",
    });
  } else if (input.quantity <= 0) {
    errors.push({
      field: "quantity",
      message: "Quantity must be greater than zero.",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
