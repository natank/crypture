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
      expect(validateQuantity('999999999')).toEqual({ valid: true });
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
});
