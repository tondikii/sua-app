/** Border-radius scale — mirrored from the Figma design-token screen. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
} as const;

export type Radius = typeof radius;
