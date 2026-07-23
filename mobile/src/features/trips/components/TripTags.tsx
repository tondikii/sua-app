import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface TripTagsProps {
  tags: string[];
  maxVisible?: number;
}

export function TripTags({ tags, maxVisible = 3 }: TripTagsProps) {
  const visible = tags.slice(0, maxVisible);
  const overflow = tags.length - maxVisible;

  return (
    <View style={styles.container}>
      {visible.map((tag, i) => (
        <View key={i} style={styles.chip}>
          <Text style={styles.label}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
        </View>
      ))}
      {overflow > 0 && (
        <View style={styles.overflowChip}>
          <Text style={styles.overflowLabel}>+{overflow}</Text>
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
    backgroundColor: colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.teal,
  },
  overflowChip: {
    backgroundColor: colors.light,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  overflowLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.muted,
  },
});
