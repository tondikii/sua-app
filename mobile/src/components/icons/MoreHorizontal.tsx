import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function MoreHorizontal({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={12} r={1.5} />
      <Circle cx={19} cy={12} r={1.5} />
      <Circle cx={5} cy={12} r={1.5} />
    </Svg>
  );
}
