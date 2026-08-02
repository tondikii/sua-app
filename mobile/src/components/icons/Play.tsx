import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Play({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
  );
}
