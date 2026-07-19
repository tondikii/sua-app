/**
 * Typography tokens — mirrored from the Figma design-token screen (Screen125).
 * Font files are loaded app-wide via `@expo-google-fonts/plus-jakarta-sans`
 * (see `app/_layout.tsx`); each weight maps to the matching exported family name.
 */
export const fontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export type FontStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
};

export const typography = {
  /** Page title — 800/24/30 */
  h1: { fontFamily: fontFamilies.extraBold, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  /** Section title — 700/18/22 */
  h2: { fontFamily: fontFamilies.bold, fontSize: 18, lineHeight: 22, fontWeight: '700' },
  /** Subtitle / label — 600/15/19 */
  h3: { fontFamily: fontFamilies.semiBold, fontSize: 15, lineHeight: 19, fontWeight: '600' },
  /** Body copy — 400/14/18 */
  body: { fontFamily: fontFamilies.regular, fontSize: 14, lineHeight: 18, fontWeight: '400' },
  /** Caption / timestamp — 500/12/16 */
  caption: { fontFamily: fontFamilies.medium, fontSize: 12, lineHeight: 16, fontWeight: '500' },
} as const satisfies Record<string, FontStyle>;

export type Typography = typeof typography;
