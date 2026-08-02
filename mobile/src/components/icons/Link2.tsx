import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

/** lucide "link-2" — rantai, dipakai untuk Link Lainnya */
export function Link2({ size = 20, color = '#1A1A2E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <Path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <Path d="M8 12h8" />
    </Svg>
  );
}
