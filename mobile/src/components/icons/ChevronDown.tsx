import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  style?: any;
}

export function ChevronDown({ size = 20, color = '#1A1A2E', style }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
}
