import React from "react";

export type FilterSortControlsProps = {
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
    <div className="flex flex-wrap items-center gap-6 mb-4 w-full">
      <div className="flex items-center gap-2 w-full max-w-xs">
        <label htmlFor="filter-assets" className="label">
          Filter assets
        </label>
        <input
          id="filter-assets"
          type="text"
          placeholder="Filter assets..."
          className="input w-full sm:w-64"
          data-testid="filter-input"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full max-w-xs">
        <label htmlFor="sort-assets" className="label">
          Sort by
        </label>
        <select
          id="sort-assets"
          className="input bg-surface w-full sm:w-48"
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
