/**
 * Color tokens — mirrored 1:1 from `figma/src/app/components/colors.ts`.
 * Single source of truth for the brand palette. Do not introduce hex literals
 * elsewhere; import from here (or via `theme.colors`).
 */
export const colors = {
  // Brand
  coral: '#FF6B6B', // Primary / CTA
  coralLight: '#FFF0F0', // Primary tint
  coralDark: '#E85555', // Primary pressed

  teal: '#4ECDC4', // Secondary / tag
  tealLight: '#EDF9F8', // Secondary tint

  // Neutrals
  charcoal: '#1A1A2E', // Text / dark UI
  muted: '#9091A0', // Placeholder / label
  mutedLight: '#B8B9C6', // Hint / disabled
  border: '#EBEBF2', // Divider / stroke
  light: '#F7F7FB', // App background
  white: '#FFFFFF', // Surface
  shadow: 'rgba(26,26,46,0.08)',

  // Danger — pure-red hue, distinct from coral
  danger: '#F94141',
  dangerDark: '#E83030',
  dangerLight: '#FFEBEB',
  dangerBorder: '#F5A8A8',

  // Amber — voting/notification highlights
  amber: '#F59E0B',
  amberLight: '#FFF8ED',

  // Semantic
  disabled: '#C8C8D4',
  overlay: 'rgba(26,26,46,0.45)',
  overlayDark: 'rgba(15,15,20,0.38)',

  // Skeleton shimmer (Figma Screen 118 — `ap-sk` gradient stops)
  shimmerBase: '#F0F0F6',
  shimmerShine: '#E4E4EE',
} as const;

/** Color token shape — values are CSS color strings (both palettes). */
export type Colors = { [K in keyof typeof colors]: string };

/**
 * Dark palette — Figma Screen 124 (Dark Mode — Beranda).
 * Coral/teal brand hues are unchanged; surfaces/neutrals go dark.
 */
export const colorsDark: Colors = {
  coral: '#FF6B6B',
  coralLight: 'rgba(255,107,107,0.16)',
  coralDark: '#E85555',

  teal: '#4ECDC4',
  tealLight: 'rgba(78,205,196,0.16)',

  charcoal: '#F0F0FA',
  muted: '#80809A',
  mutedLight: '#55556A',
  border: 'rgba(255,255,255,0.07)',
  light: '#23232F',
  white: '#1B1B26',
  shadow: 'rgba(0,0,0,0.45)',

  danger: '#F94141',
  dangerDark: '#E83030',
  dangerLight: '#FFEBEB',
  dangerBorder: '#F5A8A8',

  amber: '#F59E0B',
  amberLight: '#FFF8ED',

  disabled: '#55556A',
  overlay: 'rgba(0,0,0,0.45)',
  overlayDark: 'rgba(0,0,0,0.55)',

  shimmerBase: '#23232F',
  shimmerShine: '#2E2E3C',
};

/** Deterministic avatar background palette (figma `AVATAR_COLORS`). */
export const AVATAR_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFB347',
  '#8B7CF6',
  '#60A5FA',
  '#F472B6',
] as const;

/** Pick a stable avatar color from any seed string (e.g. user id / name). */
export function avatarColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
