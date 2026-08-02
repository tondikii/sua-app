import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Pause({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Rect x={6} y={4} width={4} height={16} rx={1} />
      <Rect x={14} y={4} width={4} height={16} rx={1} />
    </Svg>
  );
}
