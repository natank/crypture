// Jest global type declarations
declare global {
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

  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function expect(value: unknown): jest.Matchers<void>;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function jest(): jest.Jest;
}

export {};
