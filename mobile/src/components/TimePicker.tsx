import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '@/theme/colors';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

interface TimePickerProps {
  value: string;
  onChange: (t: string) => void;
  onClose?: () => void;
  label?: string;
  startLabel?: string;
  endLabel?: string;
}

export function TimePicker({
  value,
  onChange,
  onClose,
  label,
  startLabel = 'Mulai',
  endLabel = 'Selesai',
}: TimePickerProps) {
  const [h, m] = value.split(':');
  const [selHour, setSelHour] = useState(h);
  const [selMin, setSelMin] = useState(m);

  const handleConfirm = useCallback(() => {
    onChange(`${selHour}:${selMin}`);
    onClose?.();
  }, [selHour, selMin, onChange, onClose]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>{startLabel}</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {HOURS.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[styles.item, selHour === hour && styles.itemActive]}
                onPress={() => setSelHour(hour)}
              >
                <Text style={[styles.itemText, selHour === hour && styles.itemTextActive]}>
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Menit</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {MINUTES.map((min) => (
              <TouchableOpacity
                key={min}
                style={[styles.item, selMin === min && styles.itemActive]}
                onPress={() => setSelMin(min)}
              >
                <Text style={[styles.itemText, selMin === min && styles.itemTextActive]}>
                  {min}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.actions}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
          <Text style={styles.confirmText}>Pilih</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...webOutlineNone,
  },
  label: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
    marginBottom: 6,
  },
  columns: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
    marginBottom: 6,
  },
  list: {
    maxHeight: 140,
    borderRadius: 10,
    backgroundColor: colors.light,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: colors.coralLight,
  },
  itemText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  itemTextActive: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.coral,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  confirmBtn: {
    backgroundColor: colors.coral,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  confirmText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
