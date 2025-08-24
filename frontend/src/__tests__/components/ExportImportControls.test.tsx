// __tests__/ExportImportControls.test.tsx (updated)
import { render, screen, fireEvent } from "@testing-library/react";
import ExportImportControls from "@components/ExportImportControls";
import { vi } from "vitest";

describe("ExportImportControls", () => {
  it("calls onExport with the selected format and onImport when clicked", () => {
    const onExport = vi.fn();
    const onImport = vi.fn();

    render(<ExportImportControls onExport={onExport} onImport={onImport} />);

    // Default format is CSV per component state
    fireEvent.click(screen.getByTestId("export-button"));
    expect(onExport).toHaveBeenCalledWith("csv");

    // Change to JSON and export again
    const select = screen.getByLabelText(/select file format/i);
    fireEvent.change(select, { target: { value: "json" } });
    fireEvent.click(screen.getByTestId("export-button"));
    expect(onExport).toHaveBeenCalledWith("json");

    const file = new File([JSON.stringify([{ asset: "btc", quantity: 1 }])], "portfolio.json", { type: "application/json" });
    const input = screen.getByTestId("import-file-input") as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);
    fireEvent.click(screen.getByTestId("import-button"));
    expect(onImport).toHaveBeenCalled();
  });
});
