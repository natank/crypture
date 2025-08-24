import { buildExportFilename } from "@utils/filename";

describe("buildExportFilename", () => {
  const RealDate = Date;
  beforeAll(() => {
    // Freeze time to 2025-08-24
    // Months are 0-indexed in JS Date
    // We'll stub Date to return this date for new Date()
    // and keep other Date methods intact.
    (global as any).Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(2025, 7, 24, 12, 0, 0, 0);
        } else {
          // @ts-expect-error - delegating to base Date with arbitrary args in test shim
          super(...args);
        }
      }
      static now() { return new RealDate(2025, 7, 24, 12, 0, 0, 0).valueOf(); }
      static parse = RealDate.parse;
      static UTC = RealDate.UTC;
    } as unknown as DateConstructor;
  });

  afterAll(() => {
    (global as any).Date = RealDate;
  });

  it("builds filename with date-only and extension .json", () => {
    expect(buildExportFilename("json")).toBe("portfolio-2025-08-24.json");
  });

  it("builds filename with extension .csv", () => {
    expect(buildExportFilename("csv")).toBe("portfolio-2025-08-24.csv");
  });
});
