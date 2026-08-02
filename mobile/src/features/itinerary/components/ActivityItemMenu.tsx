import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pencil } from '@/components/icons/Pencil';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

/** Menu ⋮ item aktivitas — Edit · Hapus (Figma Screen 55). */
export function ActivityItemMenu({ onEdit, onDelete }: Props) {
  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.item} onPress={onEdit} activeOpacity={0.7}>
        <Pencil size={15} color={colors.charcoal} />
        <Text style={styles.itemText}>Edit</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.item} onPress={onDelete} activeOpacity={0.7}>
        <Trash2 size={15} color={colors.danger} />
        <Text style={[styles.itemText, { color: colors.danger }]}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    width: 160,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    zIndex: 30,
    ...shadows.menu,
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    paddingHorizontal: 14,
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
});
