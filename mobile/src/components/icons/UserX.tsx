import React from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function UserX({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={11} cy={8} r={5} />
      <Path d="m15 13 6 6" />
      <Path d="m21 13-6 6" />
      <Path d="M3 21a8 8 0 0 0 11.24-7" />
    </Svg>
  );
}
