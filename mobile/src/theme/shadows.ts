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
  /** Large CTA button — `0 10px 28px rgba(255,107,107,0.28)` */
  buttonLarge: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 8,
  },
  /** Compact card — `0 3px 14px rgba(26,26,46,0.08)` */
  cardCompact: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  /** Bottom sheet — `0 -10px 40px rgba(26,26,46,0.14)` */
  bottomSheet: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 10,
  },
  /** Menu / dropdown — `0 10px 32px rgba(26,26,46,0.08)` */
  menu: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  /** Modal / dialog — `0 20px 56px rgba(0,0,0,0.28)` */
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.28,
    shadowRadius: 56,
    elevation: 20,
  },
} as const satisfies Record<string, ShadowPreset>;

export type Shadows = typeof shadows;
