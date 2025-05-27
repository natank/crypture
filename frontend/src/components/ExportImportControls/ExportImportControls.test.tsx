import { render, screen, fireEvent } from "@testing-library/react";
import ExportImportControls from ".";

describe("ExportImportControls", () => {
  it("calls onExport and onImport when clicked", () => {
    const onExport = vi.fn();
    const onImport = vi.fn();

    render(<ExportImportControls onExport={onExport} onImport={onImport} />);

    fireEvent.click(screen.getByTestId("export-button"));
    fireEvent.click(screen.getByTestId("import-button"));

    expect(onExport).toHaveBeenCalled();
    expect(onImport).toHaveBeenCalled();
  });
});
