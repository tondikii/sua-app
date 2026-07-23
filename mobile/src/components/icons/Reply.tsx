import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Reply({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 17 4 12 9 7" />
      <Path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </Svg>
  );
}
