import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { fontFamilies, theme } from '../theme';

/**
 * Faithful React Native port of `figma/src/app/components/screens/Screen1Splash.tsx`.
 * Shown during app boot (font + session hydration). The native splash PNG uses
 * the same coral gradient so the handoff is seamless.
 */
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const isMajor = i % 3 === 0;
  const r1 = isMajor ? 46 : 48;
  const r2 = 54;
  return {
    key: i,
    isMajor,
    x1: 64 + r1 * Math.sin(angle),
    y1: 64 - r1 * Math.cos(angle),
    x2: 64 + r2 * Math.sin(angle),
    y2: 64 - r2 * Math.cos(angle),
  };
});

function CompassMark() {
  return (
    <Svg width={128} height={128} viewBox="0 0 128 128" fill="none">
      <Circle cx={64} cy={64} r={62} fill="rgba(255,255,255,0.07)" />
      <Circle cx={64} cy={64} r={54} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} />
      <Circle cx={64} cy={64} r={38} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      {TICKS.map((t) => (
        <Line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isMajor ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}
          strokeWidth={t.isMajor ? 1.5 : 1}
          strokeLinecap="round"
        />
      ))}
      {/* Needles — North (white) is prominent */}
      <Path d="M64 64 L56 16 L64 27 L72 16 Z" fill="white" />
      <Path d="M64 64 L56 112 L64 101 L72 112 Z" fill="rgba(255,255,255,0.32)" />
      <Path d="M64 64 L112 56 L101 64 L112 72 Z" fill="rgba(255,255,255,0.32)" />
      <Path d="M64 64 L16 56 L27 64 L16 72 Z" fill="rgba(255,255,255,0.32)" />
      {/* Hub */}
      <Circle cx={64} cy={64} r={9} fill="white" />
      <Circle cx={64} cy={64} r={4.5} fill={theme.colors.coral} />
      {/* Cardinal letters (Utara / Selatan / Timur / Barat) */}
      <SvgText x={64} y={14} textAnchor="middle" fill="white" fontSize={12} fontFamily={fontFamilies.extraBold}>
        U
      </SvgText>
      <SvgText x={64} y={122} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontFamily={fontFamilies.bold}>
        S
      </SvgText>
      <SvgText x={121} y={68} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontFamily={fontFamilies.bold}>
        T
      </SvgText>
      <SvgText x={7} y={68} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontFamily={fontFamilies.bold}>
        B
      </SvgText>
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
        <CompassMark />
      </View>

      <Text style={styles.title}>Atur Perjalanan</Text>
      <Text style={styles.tagline}>Rencanakan. Jelajahi. Kenang.</Text>

      <View style={styles.footer}>
        <View style={styles.barTrack}>
          <View style={styles.barFill} />
        </View>
      </View>
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
  footer: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
  },
  barTrack: {
    width: 120,
    height: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  barFill: {
    width: '60%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
});
