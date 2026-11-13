import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ThemePreference,
  ResolvedTheme,
  THEME_STORAGE_KEY,
  resolveTheme,
  getSavedThemePreference,
  applyTheme,
} from './theme';

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => getSavedThemePreference());
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (preference === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemIsDark]);

  // Apply to DOM whenever resolvedTheme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Listen to OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newPref);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  };

  const toggleTheme = () => {
    // If currently dark, switch to light; if light, switch to dark
    const next: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
    setPreference(next);
  };

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      toggleTheme,
    }),
    [preference, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback if used outside Provider
    return {
      preference: 'system',
      resolvedTheme: 'dark',
      setPreference: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}
