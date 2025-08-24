import { render, screen, fireEvent } from "@testing-library/react";
import ImportPreviewModal, { type ImportItem } from "@components/ImportPreviewModal";

describe("ImportPreviewModal", () => {
  const items: ImportItem[] = [
    { asset: "btc", quantity: 1.5 },
    { asset: "eth", quantity: 2 },
  ];

  it("renders items and uppercase asset symbols", () => {
    render(
      <ImportPreviewModal
        items={items}
        onCancel={() => {}}
        onMerge={() => {}}
        onReplace={() => {}}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Preview Imported Portfolio")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders empty state when items is empty", () => {
    render(
      <ImportPreviewModal items={[]} onCancel={() => {}} onMerge={() => {}} onReplace={() => {}} />
    );
    expect(screen.getByText("No items parsed")).toBeInTheDocument();
  });

  it("fires onMerge, onReplace, and onCancel", () => {
    const onMerge = vi.fn();
    const onReplace = vi.fn();
    const onCancel = vi.fn();

    render(
      <ImportPreviewModal items={items} onCancel={onCancel} onMerge={onMerge} onReplace={onReplace} />
    );

    fireEvent.click(screen.getByTestId("import-merge-button"));
    fireEvent.click(screen.getByTestId("import-replace-button"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(onMerge).toHaveBeenCalled();
    expect(onReplace).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });
});
