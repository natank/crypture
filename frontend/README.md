# CRYPTURE PROGECT

## Filter and Sort Functionality

### useFilterSort Hook
The `useFilterSort` hook manages the sorting and filtering logic for portfolio assets. It provides functions to set the sort option and filter text, and returns the sorted and filtered list of assets.

#### Usage
```javascript
const { sortedFilteredAssets, setSortOption, setFilterText } = useFilterSort(portfolioAssets);
```
- **sortedFilteredAssets**: The list of assets sorted and filtered based on the current options.
- **setSortOption**: Function to update the sort order (e.g., "name-asc", "value-desc").
- **setFilterText**: Function to update the filter text for asset names.

### FilterSortControls Component
The `FilterSortControls` component provides a UI for users to select sorting options and input filter text.

#### Props
- **filter**: The current filter text.
- **onFilterChange**: Callback to update the filter text.
- **sort**: The current sort option.
- **onSortChange**: Callback to update the sort option.

#### Example
```javascript
<FilterSortControls
  filter={filterText}
  onFilterChange={setFilterText}
  sort={sortOption}
  onSortChange={setSortOption}
/>
