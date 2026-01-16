import { getFormattedDate } from '@utils/formatDate';

describe('getFormattedDate', () => {
  it('formats provided date as YYYY-MM-DD', () => {
    const d = new Date('2025-01-02T15:30:00.000Z');
    expect(getFormattedDate(d)).toBe('2025-01-02');
  });

  it('uses current date by default (mocked)', () => {
    const RealDate = Date;
    (global as any).Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super('2024-12-31T10:00:00.000Z');
        } else {
          // @ts-expect-error - delegating to base Date with arbitrary args in test shim
          super(...args);
        }
      }
      static now() {
        return new RealDate('2024-12-31T10:00:00.000Z').valueOf();
      }
      static parse = RealDate.parse;
      static UTC = RealDate.UTC;
    } as unknown as DateConstructor;

    expect(getFormattedDate()).toBe('2024-12-31');

    (global as any).Date = RealDate;
  });
});
