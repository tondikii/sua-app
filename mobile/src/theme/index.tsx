/**
 * Theme barrel — the single import surface for design tokens.
 * All tokens stay 1:1 with `figma/src/app/components/colors.ts`.
 */
import { colors, type Colors } from './colors';
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

const tokens = {
  typography,
  spacing,
  radius,
  shadows,
} as const;

/** Theme = token sets + a `Colors` palette. */
export type Theme = typeof tokens & { colors: Colors };

export const theme: Theme = {
  ...tokens,
  colors,
} as const;

/** Light theme is the only theme — returns the static token object. */
export function useTheme(): Theme {
  return theme;
}
