import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { X } from '@/components/icons/X';
import { useTheme, type Colors } from '@/theme';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  maxTags?: number;
}

/**
 * Shared tag input — the whole container triggers input focus so users never
 * miss the tap target, tags commit on Enter, blur, or comma (Figma `TripTagsField`).
 */
export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = '+ Tambah tag...',
  maxTags = 10,
}: TagInputProps) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const commit = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (trimmed) onAdd(trimmed);
    setValue('');
  }, [onAdd]);

  const handleChangeText = useCallback((text: string) => {
    // Commit the tag (minus the comma) when the user types a comma.
    if (text.endsWith(',')) {
      const next = text.slice(0, -1);
      const trimmed = next.trim();
      if (trimmed) onAdd(trimmed);
      setValue('');
      return;
    }
    setValue(text);
  }, [onAdd]);

  return (
    <TouchableOpacity
      style={[styles.container, focused && styles.containerFocused]}
      onPress={() => inputRef.current?.focus()}
      activeOpacity={1}
    >
      {tags.map((tag) => (
        <View key={tag} style={styles.chip}>
          <Text style={styles.chipText}>{tag}</Text>
          <TouchableOpacity
            onPress={() => onRemove(tag)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <X size={11} color={c.teal} />
          </TouchableOpacity>
        </View>
      ))}
      {tags.length < maxTags && (
        <TextInput
          ref={inputRef}
          style={[styles.input, webOutlineNone]}
          placeholder={placeholder}
          placeholderTextColor={c.mutedLight}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={() => commit(value)}
          onBlur={() => {
            setFocused(false);
            commit(value);
          }}
          onFocus={() => setFocused(true)}
          returnKeyType="done"
        />
      )}
    </TouchableOpacity>
  );
}

function createStyles(c: Colors) {
  return StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    backgroundColor: c.light,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: c.border,
    minHeight: 50,
  },
  containerFocused: {
    borderColor: c.coral,
    borderWidth: 2,
    backgroundColor: c.white,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: c.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: c.teal,
  },
  input: {
    flex: 1,
    minWidth: 100,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: c.charcoal,
    paddingVertical: 4,
  },
  });
}
