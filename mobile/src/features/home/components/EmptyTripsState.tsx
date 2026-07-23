import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Line, Text as SvgText } from 'react-native-svg';
import { Plus } from '@/components/icons/Plus';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

interface EmptyTripsStateProps {
  title?: string;
  description?: string;
  onPressCta?: () => void;
}

function CompassIllustration() {
  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={50} fill={colors.coralLight} />
      <Circle cx={60} cy={60} r={38} fill="none" stroke={colors.coral} strokeWidth={2} opacity={0.3} />
      <Circle cx={60} cy={60} r={4} fill={colors.coral} />
      <Path d="M60 22 L64 56 L60 50 L56 56 Z" fill={colors.coral} />
      <Path d="M60 98 L56 64 L60 70 L64 64 Z" fill={colors.mutedLight} />
      <Path d="M22 60 L56 56 L50 60 L56 64 Z" fill={colors.teal} />
      <Path d="M98 60 L64 64 L70 60 L64 56 Z" fill={colors.mutedLight} />
      <SvgText x={60} y={18} textAnchor="middle" fontSize={10} fontFamily="PlusJakartaSans_700Bold" fill={colors.coral}>U</SvgText>
      <SvgText x={60} y={110} textAnchor="middle" fontSize={10} fontFamily="PlusJakartaSans_700Bold" fill={colors.muted}>S</SvgText>
      <SvgText x={10} y={64} textAnchor="middle" fontSize={10} fontFamily="PlusJakartaSans_700Bold" fill={colors.teal}>T</SvgText>
      <SvgText x={110} y={64} textAnchor="middle" fontSize={10} fontFamily="PlusJakartaSans_700Bold" fill={colors.muted}>B</SvgText>
    </Svg>
  );
}

export function EmptyTripsState({
  title = 'Belum ada perjalanan',
  description = 'Mulai rencanakan liburan pertamamu bersama teman-teman.',
  onPressCta,
}: EmptyTripsStateProps) {
  return (
    <View style={styles.container}>
      <CompassIllustration />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onPressCta && (
        <TouchableOpacity style={styles.cta} onPress={onPressCta} activeOpacity={0.8}>
          <Plus size={18} color={colors.white} />
          <Text style={styles.ctaText}>Buat Perjalanan Baru</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 16,
    backgroundColor: colors.coral,
    ...shadows.button,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
