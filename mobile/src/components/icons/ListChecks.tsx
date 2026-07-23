import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function ListChecks({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 6h11" />
      <Path d="M10 12h11" />
      <Path d="M10 18h11" />
      <Path d="M3 6l2 2 4-4" />
      <Path d="M3 18l2 2 4-4" />
    </Svg>
  );
}
