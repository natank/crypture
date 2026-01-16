import { describe, it, expect } from 'vitest';
import { validateQuantity } from '@utils/validateQuantity';

describe('validateQuantity', () => {
  describe('valid inputs', () => {
    it('should accept valid positive numbers', () => {
      expect(validateQuantity('1.5')).toEqual({ valid: true });
      expect(validateQuantity('100')).toEqual({ valid: true });
      expect(validateQuantity('0.00000001')).toEqual({ valid: true });
      expect(validateQuantity('1000000')).toEqual({ valid: true });
    });

    it('should accept numbers with up to 8 decimal places', () => {
      expect(validateQuantity('1.12345678')).toEqual({ valid: true });
      expect(validateQuantity('0.00000001')).toEqual({ valid: true });
    });

    it('should accept whole numbers', () => {
      expect(validateQuantity('42')).toEqual({ valid: true });
      expect(validateQuantity('1')).toEqual({ valid: true });
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty strings', () => {
      const result = validateQuantity('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity is required');
    });

    it('should reject whitespace-only strings', () => {
      const result = validateQuantity('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity is required');
    });

    it('should reject negative numbers', () => {
      const result = validateQuantity('-1');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity must be greater than zero');
    });

    it('should reject zero', () => {
      const result = validateQuantity('0');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity must be greater than zero');
    });

    it('should reject non-numeric strings', () => {
      const result = validateQuantity('abc');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid number');
    });

    it('should reject numbers with more than 8 decimal places', () => {
      const result = validateQuantity('1.123456789');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Maximum 8 decimal places allowed');
    });

    it('should reject special characters', () => {
      const result = validateQuantity('1.5$');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid number');
    });
  });

  describe('edge cases', () => {
    it('should handle very small numbers', () => {
      expect(validateQuantity('0.00000001')).toEqual({ valid: true });
    });

    it('should handle very large numbers', () => {
      const result = validateQuantity('999999999');
      expect(result.valid).toBe(true);
      // This is > 1M so it will have a warning (Phase 6)
      expect(result.warning).toBeDefined();
    });

    it('should reject negative zero', () => {
      const result = validateQuantity('-0');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity must be greater than zero');
    });

    it('should handle numbers with leading zeros', () => {
      expect(validateQuantity('01.5')).toEqual({ valid: true });
    });

    it('should handle scientific notation (parsed by parseFloat)', () => {
      // parseFloat handles scientific notation
      expect(validateQuantity('1e-7')).toEqual({ valid: true });
    });
  });

  describe('unusual value warnings (Phase 6)', () => {
    it('should warn for very large quantities (> 1,000,000)', () => {
      const result = validateQuantity('1500000');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toContain('Large quantity');
      expect(result.warning).toContain('1,500,000');
    });

    it('should warn for dust amounts (< 0.00000001)', () => {
      const result = validateQuantity('0.00000001');
      // This is exactly at threshold, so no warning
      expect(result.valid).toBe(true);
      expect(result.warning).toBeUndefined();

      // Test with a value below threshold (but within 8 decimals)
      const dustResult = validateQuantity('0.00000000');
      // This is zero, so it should error
      expect(dustResult.valid).toBe(false);

      // Use scientific notation for very small valid number
      const tinyResult = validateQuantity('1e-9');
      expect(tinyResult.valid).toBe(true);
      expect(tinyResult.warning).toContain('Very small amount');
      expect(tinyResult.warning).toContain('dust');
    });

    it('should not warn for normal quantities', () => {
      const result = validateQuantity('100');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toBeUndefined();
    });

    it('should warn at exactly 1,000,001', () => {
      const result = validateQuantity('1000001');
      expect(result.valid).toBe(true);
      expect(result.warning).toBeDefined();
    });

    it('should not warn at exactly 1,000,000', () => {
      const result = validateQuantity('1000000');
      expect(result.valid).toBe(true);
      expect(result.warning).toBeUndefined();
    });

    it('should not warn at 0.00000001 (exactly at threshold)', () => {
      const result = validateQuantity('0.00000001');
      expect(result.valid).toBe(true);
      expect(result.warning).toBeUndefined();
    });

    it('should not warn above dust threshold', () => {
      const result = validateQuantity('0.0000001');
      expect(result.valid).toBe(true);
      expect(result.warning).toBeUndefined();
    });
  });
});
