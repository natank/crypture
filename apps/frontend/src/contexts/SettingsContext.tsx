import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

export interface UserSettings {
  showAllCategories: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  showAllCategories: false, // Default to filtered categories (better UX)
};

const SETTINGS_STORAGE_KEY = 'crypture_user_settings';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const isResettingRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    // Mark as initialized
    isInitializedRef.current = true;
  }, []);

  // Save settings to localStorage whenever they change (but not during reset or before initialization)
  useEffect(() => {
    if (!isResettingRef.current && isInitializedRef.current) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save settings to localStorage:', error);
      }
    } else {
      // Reset the flag after the state update is processed
      if (isResettingRef.current) {
        isResettingRef.current = false;
      }
    }
  }, [settings, isInitializedRef.current]);

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

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
