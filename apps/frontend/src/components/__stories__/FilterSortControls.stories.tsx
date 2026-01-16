import { Meta, StoryFn } from '@storybook/react';
import FilterSortControls from '../FilterSortControls';

// ✅ Add this: import the props type
import type { FilterSortControlsProps } from '../FilterSortControls';

export default {
  title: 'Components/FilterSortControls',
  component: FilterSortControls,
} as Meta<FilterSortControlsProps>; // ✅ Pass prop type here

// ✅ Add generic <FilterSortControlsProps> to StoryFn
const Template: StoryFn<FilterSortControlsProps> = (args) => (
  <FilterSortControls {...args} />
);

export const Default = Template.bind({});
Default.args = {
  filter: '',
  onFilterChange: (value) => console.log('Filter changed:', value),
  sort: 'name-asc',
  onSortChange: (value) => console.log('Sort changed:', value),
};

export const WithFilter = Template.bind({});
WithFilter.args = {
  filter: 'active',
  onFilterChange: (value) => console.log('Filter changed:', value),
  sort: 'value-desc',
  onSortChange: (value) => console.log('Sort changed:', value),
};
