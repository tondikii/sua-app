import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Train({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={4} y={3} width={16} height={13} rx={4} />
      <Path d="M4 10h16" />
      <Path d="M9 14h.01" />
      <Path d="M15 14h.01" />
      <Path d="m8 21 2-2" />
      <Path d="m16 21-2-2" />
    </Svg>
  );
}
