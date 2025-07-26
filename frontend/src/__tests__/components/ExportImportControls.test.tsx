// __tests__/ExportImportControls.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ExportImportControls from "@components/ExportImportControls";
import { exportPortfolio } from "@utils/exportPortfolio";
import { getFormattedDate } from "@utils/formatDate";

import { vi } from "vitest";

// Mock dependencies
vi.mock("@utils/exportPortfolio", () => ({
  exportPortfolio: vi.fn(() => "mocked,data,output"),
}));

vi.mock("@utils/formatDate", () => ({
  getFormattedDate: vi.fn(() => "2099-12-31"),
}));

describe("ExportImportControls", () => {
  const portfolio = [
    { asset: "btc", quantity: 1 },
    { asset: "eth", quantity: 2 },
  ];
  const prices = {
    btc: 30000,
    eth: 2000,
  };

  beforeEach(() => {
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();

    // Spy on <a>.click()
    const originalCreateElement = document.createElement;

    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string) => {
        if (tagName === "a") {
          return {
            set href(value: string) {},
            set download(value: string) {},
            click: vi.fn(),
          } as unknown as HTMLAnchorElement;
        }
        return originalCreateElement.call(document, tagName);
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers export with correct blob and filename", () => {
    render(<ExportImportControls portfolio={portfolio} prices={prices} />);

    const button = screen.getByRole("button", {
      name: /download portfolio as csv/i,
    });

    fireEvent.click(button);

    expect(exportPortfolio).toHaveBeenCalledWith(portfolio, prices, "csv");
    expect(getFormattedDate).toHaveBeenCalled();

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
