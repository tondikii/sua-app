import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Shapes({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
      <Rect x={3} y={14} width={7} height={7} rx={1} />
      <Circle cx={17.5} cy={17.5} r={3.5} />
    </Svg>
  );
}
