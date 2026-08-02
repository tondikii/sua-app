import { Platform, type ViewStyle } from 'react-native';

/** Max content width — matches the web mobile frame in RootLayout. */
export const MOBILE_MAX_WIDTH = 430;

/** Shared width constraints for bottom slide sheets. */
export const bottomSheetFrame: ViewStyle = {
  width: '100%',
  maxWidth: MOBILE_MAX_WIDTH,
  alignSelf: 'center',
  overflow: 'hidden',
  ...Platform.select({
    web: {
      position: 'fixed' as ViewStyle['position'],
      bottom: 0,
      left: 0,
      right: 0,
      marginHorizontal: 'auto',
    },
    default: {},
  }),
};
