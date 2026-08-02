import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function UtensilsCrossed({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m16 2-5 5" />
      <Path d="m21 7-4-4" />
      <Path d="M3 3l18 18" />
      <Path d="M8 3l-2 2a5 5 0 0 0 7 7" />
      <Path d="M6 9v8" />
      <Path d="M18 9v8" />
    </Svg>
  );
}
