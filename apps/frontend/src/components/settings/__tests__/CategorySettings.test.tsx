import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { CategorySettings } from '../CategorySettings';
import { SettingsProvider } from '../../../contexts/SettingsContext';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}

describe('CategorySettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render category settings interface', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    expect(screen.getByText('Category Display')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Choose how categories are displayed in portfolio composition'
      )
    ).toBeInTheDocument();
  });

  it('should have two radio button options', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    // Check for both radio buttons
    expect(screen.getByTestId('filtered-categories')).toBeInTheDocument();
    expect(screen.getByTestId('all-categories')).toBeInTheDocument();
  });

  it('should select "Core Categories Only" by default', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    // Should have "Core Categories Only" selected by default
    const coreCategoriesRadio = screen.getByTestId('filtered-categories');
    const allCategoriesRadio = screen.getByTestId('all-categories');

    expect(coreCategoriesRadio).toBeChecked();
    expect(allCategoriesRadio).not.toBeChecked();
  });

  it('should show descriptive text for each option', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    expect(
      screen.getByText('Show only coin characteristics (recommended)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Include index funds and investment categories')
    ).toBeInTheDocument();
  });

  it('should show information section with examples', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    expect(screen.getByText('Core Categories:')).toBeInTheDocument();
    expect(
      screen.getByText('Layer 1, Proof of Work, Smart Contract Platform, etc.')
    ).toBeInTheDocument();
    expect(screen.getByText('Index Categories:')).toBeInTheDocument();
    expect(
      screen.getByText('GMCI Index, Coinbase 50, FTX Holdings, etc.')
    ).toBeInTheDocument();
  });

  it('should allow switching to "All Categories"', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    const allCategoriesRadio = screen.getByTestId('all-categories');

    // Initially not checked
    expect(allCategoriesRadio).not.toBeChecked();

    // Click to select
    await user.click(allCategoriesRadio);
    expect(allCategoriesRadio).toBeChecked();

    // Core categories should be unchecked
    expect(screen.getByTestId('filtered-categories')).not.toBeChecked();
  });

  it('should allow switching back to "Core Categories Only"', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    // First switch to all categories
    const allCategoriesRadio = screen.getByTestId('all-categories');
    await user.click(allCategoriesRadio);
    expect(allCategoriesRadio).toBeChecked();

    // Then switch back to core categories
    const coreCategoriesRadio = screen.getByTestId('filtered-categories');
    await user.click(coreCategoriesRadio);
    expect(coreCategoriesRadio).toBeChecked();
    expect(allCategoriesRadio).not.toBeChecked();
  });

  it('should load saved preference from localStorage', () => {
    // Set up localStorage with preference for all categories
    localStorage.setItem(
      'crypture_user_settings',
      JSON.stringify({
        showAllCategories: true,
      })
    );

    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    // Should have "All Categories" selected
    expect(screen.getByTestId('all-categories')).toBeChecked();
    expect(screen.getByTestId('filtered-categories')).not.toBeChecked();
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <TestWrapper>
        <CategorySettings className="custom-test-class" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    const coreCategoriesRadio = screen.getByTestId('filtered-categories');
    const allCategoriesRadio = screen.getByTestId('all-categories');

    // Check for proper form attributes
    expect(coreCategoriesRadio).toHaveAttribute('type', 'radio');
    expect(coreCategoriesRadio).toHaveAttribute('name', 'categoryDisplay');
    expect(allCategoriesRadio).toHaveAttribute('type', 'radio');
    expect(allCategoriesRadio).toHaveAttribute('name', 'categoryDisplay');

    // Both should have the same name for radio button grouping
    expect(coreCategoriesRadio.getAttribute('name')).toBe(
      allCategoriesRadio.getAttribute('name')
    );
  });

  it('should have proper styling classes', () => {
    render(
      <TestWrapper>
        <CategorySettings />
      </TestWrapper>
    );

    const coreCategoriesRadio = screen.getByTestId('filtered-categories');
    const allCategoriesRadio = screen.getByTestId('all-categories');

    // Check for Tailwind classes
    expect(coreCategoriesRadio).toHaveClass('w-4', 'h-4', 'text-brand-primary');
    expect(allCategoriesRadio).toHaveClass('w-4', 'h-4', 'text-brand-primary');
  });
});
