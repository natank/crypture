import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SettingsProvider, useSettings } from '../SettingsContext';

// Test component that uses the settings context
function TestComponent() {
  const { settings, updateSettings, resetSettings } = useSettings();
  
  return (
    <div>
      <div data-testid="show-all-categories">
        {settings.showAllCategories.toString()}
      </div>
      <button 
        onClick={() => updateSettings({ showAllCategories: true })}
        data-testid="enable-all-categories"
      >
        Enable All Categories
      </button>
      <button 
        onClick={() => updateSettings({ showAllCategories: false })}
        data-testid="disable-all-categories"
      >
        Disable All Categories
      </button>
      <button 
        onClick={resetSettings}
        data-testid="reset-settings"
      >
        Reset Settings
      </button>
    </div>
  );
}

describe('SettingsContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  it('should provide default settings', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('false');
  });

  it('should update settings when updateSettings is called', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Initially should be false
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('false');

    // Enable all categories
    await user.click(screen.getByTestId('enable-all-categories'));
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('true');

    // Disable all categories
    await user.click(screen.getByTestId('disable-all-categories'));
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('false');
  });

  it('should reset settings to defaults when resetSettings is called', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Enable all categories first
    await user.click(screen.getByTestId('enable-all-categories'));
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('true');

    // Reset settings
    await user.click(screen.getByTestId('reset-settings'));
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('false');
  });

  it('should load settings from localStorage on mount', () => {
    // Set up localStorage with existing settings
    localStorage.setItem('crypture_user_settings', JSON.stringify({
      showAllCategories: true
    }));

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Should load the saved setting
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('true');
  });

  it('should save settings to localStorage when updated', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Update setting
    await user.click(screen.getByTestId('enable-all-categories'));

    // Check localStorage
    const savedSettings = localStorage.getItem('crypture_user_settings');
    expect(savedSettings).toBeTruthy();
    
    const parsed = JSON.parse(savedSettings!);
    expect(parsed.showAllCategories).toBe(true);
  });

  it('should handle corrupted localStorage gracefully', () => {
    // Set up corrupted localStorage data
    localStorage.setItem('crypture_user_settings', 'invalid-json');

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Should fall back to defaults
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('false');
  });

  it('should merge partial updates with existing settings', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Update one setting
    await user.click(screen.getByTestId('enable-all-categories'));
    expect(screen.getByTestId('show-all-categories')).toHaveTextContent('true');

    // Verify the setting is preserved in localStorage
    const savedSettings = localStorage.getItem('crypture_user_settings');
    const parsed = JSON.parse(savedSettings!);
    expect(parsed.showAllCategories).toBe(true);
  });

  it('should remove localStorage item when reset', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Update setting first
    await user.click(screen.getByTestId('enable-all-categories'));
    expect(localStorage.getItem('crypture_user_settings')).toBeTruthy();

    // Reset settings
    await user.click(screen.getByTestId('reset-settings'));
    
    // Should remove from localStorage
    expect(localStorage.getItem('crypture_user_settings')).toBeNull();
  });

  it('should throw error when useSettings is used outside provider', () => {
    // Suppress console error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSettings must be used within a SettingsProvider');

    // Restore console.error
    console.error = originalError;
  });
});
