/**
 * Theme barrel — the single import surface for design tokens.
 * Light theme default; dark mode (Figma Screen 124) via `ThemeProvider` +
 * `useTheme()`. All tokens stay 1:1 with `figma/src/app/components/colors.ts`.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, colorsDark, type Colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './layout';

export type ColorScheme = 'light' | 'dark';

const tokens = {
  typography,
  spacing,
  radius,
  shadows,
} as const;

/** Theme = token sets + a `Colors` palette (string-valued, both palettes). */
export type Theme = typeof tokens & { colors: Colors };

export const theme: Theme = {
  ...tokens,
  colors,
} as const;

export const themeDark: Theme = {
  ...tokens,
  colors: colorsDark,
} as const;

const THEME_STORAGE_KEY = 'ap_color_scheme';

/**
 * Theme context. Defaults to the light palette; the active scheme is persisted
 * in AsyncStorage (`ap_color_scheme`) and hydrated on mount. `useTheme()`
 * returns the full token object for the active scheme, so screens can consume
 * `const { colors } = useTheme()` instead of the static `colors` import.
 */
interface ThemeContextValue {
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'light',
  setScheme: () => {},
  toggleScheme: () => {},
  isHydrated: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((value) => {
        if (value === 'dark' || value === 'light') setSchemeState(value);
      })
      .finally(() => setIsHydrated(true));
  }, []);

  const setScheme = useCallback((next: ColorScheme) => {
    setSchemeState(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggleScheme = useCallback(() => {
    setSchemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ scheme, setScheme, toggleScheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function useTheme(): Theme {
  const { scheme } = useContext(ThemeContext);
  return scheme === 'dark' ? themeDark : theme;
}
