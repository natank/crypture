import { createContext } from 'react';

export interface UserSettings {
  showAllCategories: boolean;
}

export interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
