import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { Plus } from '@/components/icons/Plus';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

interface EmptyTripsStateProps {
  title?: string;
  description?: string;
  onPressCta?: () => void;
  compact?: boolean;
}

function GlobeIllustration({ size = 'default' }: { size?: 'default' | 'compact' }) {
  const w = size === 'compact' ? 120 : 190;
  const h = size === 'compact' ? 106 : 168;
  const s = size === 'compact' ? 0.63 : 1;

  return (
    <Svg width={w} height={h} viewBox="0 0 190 168" fill="none">
      <Circle cx={95} cy={84} r={72} fill="#EDF9F8" />
      <Circle cx={95} cy={84} r={52} fill="white" stroke="#E0F5F4" strokeWidth={2} />
      <Ellipse cx={95} cy={84} rx={52} ry={22} fill="none" stroke="#4ECDC4" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
      <Path d="M95 32 L95 136" stroke="#4ECDC4" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
      <Path d="M43 84 L147 84" stroke="#4ECDC4" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
      <Path d="M60 95 Q95 55 130 78" stroke="#FF6B6B" strokeWidth={2} strokeDasharray="4 3" fill="none" opacity={0.8} />
      <Circle cx={60} cy={95} r={5} fill="#FF6B6B" opacity={0.5} />
      <Path d="M130 78 C130 70,138 62,138 62 C138 62,146 70,146 78 C146 86,138 92,138 92 C138 92,130 86,130 78Z" fill="#FF6B6B" />
      <Circle cx={138} cy={78} r={4} fill="white" />
      <G transform="translate(90, 65) rotate(-30)">
        <Path d="M0 0 L14 -5 L14 0 L8 3Z" fill="#FF6B6B" />
        <Path d="M0 0 L5 7 L3 10" fill="#FF6B6B" opacity={0.6} />
      </G>
      <Circle cx={42} cy={56} r={3.5} fill="#FFB347" />
      <Circle cx={156} cy={52} r={3} fill="#4ECDC4" />
      <Circle cx={162} cy={106} r={2.5} fill="#FF6B6B" opacity={0.6} />
      <Circle cx={35} cy={112} r={2.5} fill="#4ECDC4" opacity={0.7} />
      <Path d="M162 56 L163.5 59 L167 59 L164 61 L165 65 L162 63 L159 65 L160 61 L157 59 L160.5 59Z" fill="#FFB347" opacity={0.6} />
    </Svg>
  );
}

export function EmptyTripsState({
  title = 'Belum ada perjalanan',
  description = 'Mulai rencanakan liburan pertamamu bersama teman-teman.',
  onPressCta,
  compact = false,
}: EmptyTripsStateProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <GlobeIllustration size={compact ? 'compact' : 'default'} />
      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
      <Text style={[styles.description, compact && styles.descriptionCompact]}>{description}</Text>
      {onPressCta && (
        <TouchableOpacity
          style={[styles.cta, compact && styles.ctaCompact]}
          onPress={onPressCta}
          activeOpacity={0.8}
        >
          <Plus size={compact ? 15 : 18} color={colors.white} />
          <Text style={[styles.ctaText, compact && styles.ctaTextCompact]}>Buat Perjalanan Baru</Text>
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
  containerCompact: {
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  titleCompact: {
    fontSize: 15,
    marginTop: 10,
  },
  description: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  descriptionCompact: {
    fontSize: 12,
    marginTop: 6,
    maxWidth: 260,
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
  ctaCompact: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 16,
    gap: 6,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  ctaTextCompact: {
    fontSize: 13,
  },
});
