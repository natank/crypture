import React from 'react';
import { Category } from 'types/market';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isLoading: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 bg-gray-200 rounded-full flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      data-testid="category-filter"
    >
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-brand-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.category_id}
          onClick={() => onSelectCategory(category.category_id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category.category_id
              ? 'bg-brand-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
