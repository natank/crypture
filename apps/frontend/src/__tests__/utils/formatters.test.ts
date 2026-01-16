import { describe, it, expect } from 'vitest';
import { formatLargeNumber, formatPercentage } from '../../utils/formatters';

describe('formatters', () => {
    describe('formatLargeNumber', () => {
        it('formats trillions correctly', () => {
            expect(formatLargeNumber(2_500_000_000_000)).toBe('$2.50T');
            expect(formatLargeNumber(1_000_000_000_000)).toBe('$1.00T');
        });

        it('formats billions correctly', () => {
            expect(formatLargeNumber(120_000_000_000)).toBe('$120.00B');
            expect(formatLargeNumber(1_500_000_000)).toBe('$1.50B');
        });

        it('formats millions correctly', () => {
            expect(formatLargeNumber(45_200_000)).toBe('$45.20M');
            expect(formatLargeNumber(1_000_000)).toBe('$1.00M');
        });

        it('formats thousands correctly', () => {
            expect(formatLargeNumber(123_456)).toBe('$123.46K');
            expect(formatLargeNumber(1_000)).toBe('$1.00K');
        });

        it('formats small numbers correctly', () => {
            expect(formatLargeNumber(500)).toBe('$500.00');
            expect(formatLargeNumber(0)).toBe('$0.00');
        });

        it('handles negative numbers', () => {
            expect(formatLargeNumber(-1_000_000)).toBe('-$1.00M');
        });
    });

    describe('formatPercentage', () => {
        it('formats positive percentage correctly', () => {
            expect(formatPercentage(2.345)).toBe('2.35%');
            expect(formatPercentage(10.5)).toBe('10.50%');
        });

        it('formats negative percentage correctly', () => {
            expect(formatPercentage(-5.123)).toBe('-5.12%');
        });

        it('formats zero correctly', () => {
            expect(formatPercentage(0)).toBe('0.00%');
        });
    });
});
