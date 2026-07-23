import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Settings2({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 7h-9" />
      <Path d="M14 17H5" />
      <Circle cx={17} cy={17} r={3} />
      <Circle cx={7} cy={7} r={3} />
    </Svg>
  );
}
