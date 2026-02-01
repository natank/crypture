import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  UserSettings,
  SettingsContext,
  SettingsContextType,
} from './SettingsContext.types';

const DEFAULT_SETTINGS: UserSettings = {
  showAllCategories: false, // Default to filtered categories (better UX)
};

const SETTINGS_STORAGE_KEY = 'crypture_user_settings';

interface SettingsProviderProps {
  children: ReactNode;
}

function loadSettingsFromStorage(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsedSettings = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsedSettings };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>(
    loadSettingsFromStorage
  );
  const isResettingRef = useRef(false);

  // Save settings to localStorage whenever they change (but not during reset)
  useEffect(() => {
    if (!isResettingRef.current) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save settings to localStorage:', error);
      }
    } else {
      // Reset the flag after the state update is processed
      isResettingRef.current = false;
    }
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    isResettingRef.current = true;
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
