/// <reference types="jest" />

import { Request } from 'express';

// Global type declarations for the entire project
declare global {
  // Extended Request interface with requestId and startTime
  interface ExtendedRequest extends Request {
    requestId?: string;
    _startTime?: number;
  }

  // Jest global functions
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function expect(value: unknown): jest.Matchers<void, unknown>;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;

  // Jest matchers
  namespace jest {
    interface Matchers<R> {
      toBe(expected: unknown): R;
      toEqual(expected: unknown): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: unknown[]): R;
      toHaveProperty(prop: string, value?: unknown): R;
      toMatch(pattern: string | RegExp): R;
      toContain(item: unknown): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeNull(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeGreaterThan(number: number): R;
      toBeLessThan(number: number): R;
      toThrow(error?: string | RegExp | Error): R;
    }
  }
}

export {};
