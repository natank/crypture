// __tests__/import-portfolio.test.ts

import { ParsedPortfolioItem, parseImportedFile } from "@utils/importPortfolio";
import { describe, it, expect } from "vitest";

function createMockFile(
  name: string,
  content: string,
  type = "text/plain"
): File {
  const blob = new Blob([content], { type });
  const file = new File([blob], name, { type });

  // Polyfill .text() for Node-based test environments
  Object.defineProperty(file, "text", {
    value: () => Promise.resolve(content),
  });

  return file;
}
describe("parseImportedFile()", () => {
  it("parses valid JSON file correctly", async () => {
    const jsonContent = JSON.stringify([
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 0.75 },
    ]);
    const file = createMockFile(
      "portfolio.json",
      jsonContent,
      "application/json"
    );

    const result = await parseImportedFile(file);
    expect(result).toEqual<ParsedPortfolioItem[]>([
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 0.75 },
    ]);
  });

  it("parses valid CSV file correctly", async () => {
    const csvContent = `Asset,Quantity\nbtc,1.5\neth,0.75`;
    const file = createMockFile("portfolio.csv", csvContent, "text/csv");

    const result = await parseImportedFile(file);
    expect(result).toEqual<ParsedPortfolioItem[]>([
      { asset: "btc", quantity: 1.5 },
      { asset: "eth", quantity: 0.75 },
    ]);
  });

  it("throws error on unsupported file type", async () => {
    const file = createMockFile("portfolio.txt", "irrelevant data");

    await expect(() => parseImportedFile(file)).rejects.toThrow(
      /unsupported file format/i
    );
  });

  it("throws error on malformed JSON", async () => {
    const badJson = `[{ "asset": "btc", "quantity": 1.2 },]`;
    const file = createMockFile("portfolio.json", badJson, "application/json");

    await expect(() => parseImportedFile(file)).rejects.toThrow(
      /invalid json/i
    );
  });

  it("throws error on empty CSV", async () => {
    const file = createMockFile("portfolio.csv", "Asset,Quantity\n");

    await expect(parseImportedFile(file)).rejects.toThrow(/missing data rows/i);
  });
});
