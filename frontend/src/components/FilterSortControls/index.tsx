import React from "react";

export type FilterSortControlsProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  disabled?: boolean;
};

export default function FilterSortControls({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  disabled = false,
}: FilterSortControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 w-full">
      {/* 🔍 Filter Input */}
      <div className="relative w-full sm:w-64">
        <label htmlFor="filter-assets" className="sr-only">
          Filter assets
        </label>
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          🔍
        </span>
        <input
          id="filter-assets"
          type="text"
          placeholder="Search assets..."
          aria-label="Filter assets"
          aria-disabled={disabled}
          data-testid="filter-input"
          value={filter}
          onChange={(e) => {
            if (disabled) return;
            onFilterChange(e.target.value);
          }}
          disabled={disabled}
          className="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full text-base text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        />
      </div>

      {/* 🔃 Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-assets"
          className="text-base text-gray-700 font-subtle"
        >
          Sort:
        </label>

        <select
          id="sort-assets"
          aria-label="Sort asset list"
          aria-disabled={disabled}
          data-testid="sort-dropdown"
          value={sort}
          onChange={(e) => {
            if (disabled) return;
            onSortChange(e.target.value);
          }}
          disabled={disabled}
          className="px-3 py-2 border border-gray-200 rounded-md bg-white text-base sm:w-48 w-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="value-desc">Value ⬇</option>
          <option value="value-asc">Value ⬆</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
        </select>
      </div>
    </div>
  );
}
