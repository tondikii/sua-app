import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { typography } from '@/theme/typography';

interface TripTagsProps {
  tags: string[];
  maxVisible?: number;
}

export function TripTags({ tags, maxVisible = 3 }: TripTagsProps) {
  const { colors: c } = useTheme();
  const visible = tags.slice(0, maxVisible);
  const overflow = tags.length - maxVisible;

  return (
    <View style={styles.container}>
      {visible.map((tag, i) => (
        <View key={i} style={[styles.chip, { backgroundColor: c.tealLight }]}>
          <Text style={[styles.label, { color: c.teal }]}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
        </View>
      ))}
      {overflow > 0 && (
        <View style={[styles.overflowChip, { backgroundColor: c.light }]}>
          <Text style={[styles.overflowLabel, { color: c.muted }]}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
  overflowChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  overflowLabel: {
    ...typography.caption,
    fontWeight: '700',
  },
});
