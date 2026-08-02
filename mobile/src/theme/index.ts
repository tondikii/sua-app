/**
 * Theme barrel — the single import surface for design tokens.
 * Light theme only for now; dark mode (ThemeContext switching) lands in M17.
 */
import { createContext, useContext } from 'react';

import { colors } from './colors';
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

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;

/**
 * Light theme by default. `ThemeProvider` is exposed so M17 can swap in a dark
 * theme without touching call sites; today the default context value is `theme`.
 */
const ThemeContext = createContext<Theme>(theme);
export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
