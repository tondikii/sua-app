import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme, type Colors } from '@/theme';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

interface TimePickerProps {
  visible: boolean;
  value: string;
  onChange: (t: string) => void;
  onClose: () => void;
  label?: string;
  startLabel?: string;
  endLabel?: string;
}

/**
 * Time picker as a centered popup (Modal). Scrollable columns that work on
 * Android (nested vertical ScrollViews inside a Modal). Tap outside / Batal to
 * dismiss.
 */
export function TimePicker({
  visible,
  value,
  onChange,
  onClose,
  label,
  startLabel = 'Mulai',
  endLabel = 'Selesai',
}: TimePickerProps) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);
  const [h, m] = value.split(':');
  const [selHour, setSelHour] = useState(h);
  const [selMin, setSelMin] = useState(m);

  const handleConfirm = useCallback(() => {
    onChange(`${selHour}:${selMin}`);
    onClose();
  }, [selHour, selMin, onChange, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.columnLabel}>{startLabel}</Text>
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
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
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
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
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Pilih</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const webOutlineNone = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {};

function createStyles(c: Colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(26,26,46,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 26,
    },
    container: {
      width: '100%',
      maxWidth: 300,
      padding: 12,
      paddingHorizontal: 14,
      backgroundColor: c.white,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: c.border,
      ...webOutlineNone,
    },
    label: {
      fontSize: 11,
      fontFamily: 'PlusJakartaSans_600SemiBold',
      color: c.muted,
      marginBottom: 6,
      textAlign: 'center',
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
      color: c.muted,
      marginBottom: 6,
    },
    list: {
      maxHeight: 160,
      borderRadius: 10,
      backgroundColor: c.light,
    },
    item: {
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignItems: 'center',
    },
    itemActive: {
      backgroundColor: c.coralLight,
    },
    itemText: {
      fontSize: 15,
      fontFamily: 'PlusJakartaSans_500Medium',
      color: c.charcoal,
    },
    itemTextActive: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      color: c.coral,
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
      color: c.muted,
    },
    confirmBtn: {
      backgroundColor: c.coral,
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 16,
    },
    confirmText: {
      fontSize: 13,
      fontFamily: 'PlusJakartaSans_700Bold',
      color: c.white,
    },
  });
}
