import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Polygon } from 'react-native-svg';

import { fontFamilies, theme } from '../theme';

/**
 * Faithful React Native port of `figma/src/app/components/screens/Screen1Splash.tsx`.
 * Shown during app boot (font + session hydration). The native splash PNG uses
 * the same coral gradient so the handoff is seamless.
 */

/** Simple compass mark — same as the sign-in CompassIcon. */
function CompassIcon() {
  return (
    <Svg width={128} height={128} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke="white" strokeWidth={2} />
      <Polygon
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        fill="white"
      />
    </Svg>
  );
}

export function SplashScreen() {
  return (
    <LinearGradient
      colors={['#FF8A65', '#FF6B6B', '#F94E4E']}
      locations={[0, 0.48, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.container}
    >
      <View style={styles.rings} pointerEvents="none">
        <View style={[styles.ring, { width: 340, height: 340 }]} />
        <View style={[styles.ring, { width: 480, height: 480 }]} />
      </View>

      <View style={styles.logoWell}>
        <CompassIcon />
      </View>

      <Text style={styles.title}>Atur Perjalanan</Text>
      <Text style={styles.tagline}>Rencanakan. Jelajahi. Kenang.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rings: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  logoWell: {
    width: 156,
    height: 156,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    color: theme.colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    fontFamily: fontFamilies.extraBold,
  },
  tagline: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: fontFamilies.medium,
    marginTop: 10,
  },
});
