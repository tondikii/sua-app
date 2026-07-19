import type { ViewStyle } from 'react-native';

/**
 * Shadow presets — mirrored from Figma.
 * React Native `shadow*` props are rendered as `box-shadow` on web by
 * react-native-web, so a single definition works on iOS / web. Android only
 * supports `elevation` (monochrome), which we set as a reasonable approximation.
 */
export type ShadowPreset = ViewStyle;

export const shadows = {
  /** Cards / surfaces — `0 4px 24px rgba(26,26,46,0.08)` */
  card: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  /** Elevated elements (FAB, sheets) — `0 8px 32px rgba(26,26,46,0.08)` */
  elevated: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 6,
  },
  /** Primary coral button — `0 6px 18px rgba(255,107,107,0.25)` */
  button: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 4,
  },
} as const satisfies Record<string, ShadowPreset>;

export type Shadows = typeof shadows;
