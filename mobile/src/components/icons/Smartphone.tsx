import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Smartphone({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect width={14} height={20} x={5} y={2} rx={2} ry={2} />
      <Path d="M12 18h.01" />
    </Svg>
  );
}
