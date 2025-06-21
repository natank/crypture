import React from "react";

type FilterSortControlsProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
};

export default function FilterSortControls({
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: FilterSortControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <label
          htmlFor="filter-assets"
          className="text-sm font-medium text-gray-700"
        >
          Filter assets
        </label>
        <input
          id="filter-assets"
          type="text"
          placeholder="Filter assets..."
          className="px-3 py-2 border border-gray-200 rounded-md w-full sm:w-64 placeholder:text-gray-700"
          data-testid="filter-input"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-assets"
          className="text-sm font-medium text-gray-700"
        >
          Sort by
        </label>
        <select
          id="sort-assets"
          className="px-3 py-2 border border-gray-200 rounded-md bg-white sm:w-48 w-full text-gray-900"
          data-testid="sort-dropdown"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="value-desc">Sort by Value ⬇</option>
          <option value="value-asc">Sort by Value ⬆</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
        </select>
      </div>
    </div>
  );
}
