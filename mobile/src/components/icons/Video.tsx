import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Video({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <Rect x={2} y={6} width={14} height={12} rx={2} />
    </Svg>
  );
}
