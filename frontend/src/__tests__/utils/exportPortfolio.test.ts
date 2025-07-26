// __tests__/exportPortfolio.test.ts

import { exportPortfolio } from "@utils/exportPortfolio";

describe("exportPortfolio", () => {
  const portfolio = [
    { asset: "btc", quantity: 2 },
    { asset: "eth", quantity: 1.5 },
  ];

  const prices = {
    btc: 30000,
    eth: 2000,
  };

  it("exports JSON with correct structure and values", () => {
    const output = exportPortfolio(portfolio, prices, "json");
    const parsed = JSON.parse(output);

    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({
      asset: "btc",
      quantity: 2,
      value: 60000,
    });
    expect(parsed[1].value).toBe(3000);
  });

  it("exports CSV with proper headers and values", () => {
    const output = exportPortfolio(portfolio, prices, "csv");
    const lines = output.split("\n");

    expect(lines[0]).toBe("Asset,Quantity,Value (USD)");
    expect(lines[1]).toContain("btc");
    expect(lines[1]).toContain("60,000.00");
    expect(lines[2]).toContain("3,000.00");
  });

  it("wraps values with commas in quotes in CSV", () => {
    const highValuePortfolio = [{ asset: "btc", quantity: 10 }];
    const highPrice = { btc: 1234567.89 };

    const output = exportPortfolio(highValuePortfolio, highPrice, "csv");
    const lines = output.split("\n");
    const row = lines[1];

    expect(row).toContain('"12,345,678.90"'); // 10 * 1,234,567.89
  });

  it("handles missing price gracefully", () => {
    const partialPrices = { btc: 50000 };
    const output = exportPortfolio(portfolio, partialPrices, "csv");
    const lines = output.split("\n");

    expect(lines[2]).toContain("0.00"); // eth missing from price map
  });

  it("throws error for unsupported format", () => {
    expect(() => exportPortfolio(portfolio, prices, "xml" as any)).toThrow(
      "Unsupported export format"
    );
  });
});
