/**
 * Validates a quantity input string for crypto asset editing.
 * 
 * Requirements:
 * - Must be a positive number
 * - Cannot be zero
 * - Maximum 8 decimal places (standard for crypto)
 * - No special characters except decimal point
 * - Warns for unusually large values (> 1,000,000)
 * - Warns for dust amounts (< 0.00000001)
 * 
 * @param value - The string value to validate (from input field)
 * @returns Validation result with error message if invalid, warning if unusual
 */
export type ValidationResult = {
  valid: boolean;
  error?: string;
  warning?: string;
};

export function validateQuantity(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      valid: false,
      error: 'Quantity is required',
    };
  }

  const validNumberPattern = /^-?\d*\.?\d+([eE][-+]?\d+)?$/;
  if (!validNumberPattern.test(value.trim())) {
    return {
      valid: false,
      error: 'Please enter a valid number',
    };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return {
      valid: false,
      error: 'Please enter a valid number',
    };
  }

  if (numValue <= 0) {
    return {
      valid: false,
      error: 'Quantity must be greater than zero',
    };
  }

  const decimalMatch = value.match(/\.(\d+)/);
  if (decimalMatch && decimalMatch[1].length > 8) {
    return {
      valid: false,
      error: 'Maximum 8 decimal places allowed',
    };
  }

  // Check for unusual values (non-blocking warnings)
  const LARGE_QUANTITY_THRESHOLD = 1000000;
  const DUST_AMOUNT_THRESHOLD = 0.00000001;

  if (numValue > LARGE_QUANTITY_THRESHOLD) {
    return {
      valid: true,
      warning: `⚠️ Large quantity (${numValue.toLocaleString()}). Please verify this is correct.`,
    };
  }

  if (numValue < DUST_AMOUNT_THRESHOLD) {
    return {
      valid: true,
      warning: `⚠️ Very small amount (${numValue}). This may be a dust amount.`,
    };
  }

  return {
    valid: true,
  };
}
