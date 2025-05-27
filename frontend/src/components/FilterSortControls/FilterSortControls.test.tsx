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
});
