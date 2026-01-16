import { render, screen, fireEvent } from "@testing-library/react";
import FilterSortControls from ".";

describe("FilterSortControls", () => {
  it("calls handlers on input and dropdown change", () => {
    const onFilterChange = vi.fn();
    const onSortChange = vi.fn();

    render(
      <FilterSortControls
        filter=""
        sort="value-desc"
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
      />
    );

    fireEvent.change(screen.getByTestId("filter-input"), {
      target: { value: "BTC" },
    });
    fireEvent.change(screen.getByTestId("sort-dropdown"), {
      target: { value: "name-asc" },
    });

    expect(onFilterChange).toHaveBeenCalledWith("BTC");
    expect(onSortChange).toHaveBeenCalledWith("name-asc");
  });

  it("disables inputs and does not call handlers when disabled", () => {
    const onFilterChange = vi.fn();
    const onSortChange = vi.fn();

    render(
      <FilterSortControls
        filter=""
        sort="value-desc"
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        disabled
      />
    );

    const filter = screen.getByTestId("filter-input") as HTMLInputElement;
    const sort = screen.getByTestId("sort-dropdown") as HTMLSelectElement;

    expect(filter).toBeDisabled();
    expect(sort).toBeDisabled();

    fireEvent.change(filter, { target: { value: "ETH" } });
    fireEvent.change(sort, { target: { value: "name-desc" } });

    expect(onFilterChange).not.toHaveBeenCalled();
    expect(onSortChange).not.toHaveBeenCalled();
  });
});
