import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function CircleStop({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={10} />
      <Rect x={9} y={9} width={6} height={6} rx={1} fill={color} stroke="none" />
    </Svg>
  );
}
