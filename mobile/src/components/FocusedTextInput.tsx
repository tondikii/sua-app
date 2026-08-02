import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { colors } from '@/theme/colors';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

interface FocusedTextInputProps extends TextInputProps {
  /** Extra style merged when the input is focused (e.g. container highlight). */
  focusedStyle?: object | object[];
}

/**
 * TextInput with a consistent coral focus border on every platform.
 * On web it also strips the browser default navy focus ring.
 */
export function FocusedTextInput({
  style,
  focusedStyle,
  onFocus,
  onBlur,
  ...rest
}: FocusedTextInputProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback((e: any) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: any) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  return (
    <TextInput
      {...rest}
      style={[webOutlineNone, style, focused && styles.focused, focused && focusedStyle]}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

const styles = StyleSheet.create({
  focused: {
    borderColor: colors.coral,
    borderWidth: 2,
  },
});
