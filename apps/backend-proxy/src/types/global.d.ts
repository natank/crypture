/// <reference types="jest" />

// Global type declarations for the entire project
declare global {
  // Jest global functions
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function expect(value: any): any;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  
  // Jest matchers
  namespace jest {
    interface Matchers<R> {
      toBe(expected: any): R;
      toEqual(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveProperty(prop: string, value?: any): R;
      toMatch(pattern: string | RegExp): R;
      toContain(item: any): R;
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
