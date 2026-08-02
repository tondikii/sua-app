import React from 'react';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

/** lucide "navigation" — penunjuk arah, dipakai untuk link Google Maps */
export function Navigation({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="3 11 22 2 13 21 11 13 3 11" />
      <Circle cx={12} cy={12} r={0.5} />
    </Svg>
  );
}
