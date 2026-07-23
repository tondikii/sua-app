import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ActivityKind } from '@atur-perjalanan/shared-types';
import { useCreateActivity } from '@/features/activities/hooks/useCreateActivity';
import { X } from '@/components/icons/X';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

const KIND_OPTIONS: { value: ActivityKind; label: string; emoji: string }[] = [
  { value: 'gather', label: 'Kumpul', emoji: '🤝' },
  { value: 'transport', label: 'Transportasi', emoji: '🚌' },
  { value: 'meal', label: 'Makan', emoji: '🍽️' },
  { value: 'activity', label: 'Aktivitas', emoji: '🎯' },
  { value: 'destination', label: 'Destinasi', emoji: '📍' },
];

interface ActivityFormSheetProps {
  visible: boolean;
  tripId: string;
  activityDate?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActivityFormSheet({
  visible,
  tripId,
  activityDate,
  onClose,
  onSuccess,
}: ActivityFormSheetProps) {
  const insets = useSafeAreaInsets();
  const createActivity = useCreateActivity(tripId);

  const [placeName, setPlaceName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [kind, setKind] = useState<ActivityKind>('activity');
  const [description, setDescription] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [mapsLink, setMapsLink] = useState('');

  const reset = useCallback(() => {
    setPlaceName('');
    setStartTime('09:00');
    setEndTime('10:00');
    setKind('activity');
    setDescription('');
    setLocationLabel('');
    setMapsLink('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!placeName.trim()) {
      Alert.alert('Validasi', 'Nama aktivitas wajib diisi');
      return;
    }

    try {
      await createActivity.mutateAsync({
        place_name: placeName.trim(),
        start_time: startTime,
        end_time: endTime,
        kind,
        description: description.trim() || undefined,
        location_label: locationLabel.trim() || undefined,
        maps_link: mapsLink.trim() || undefined,
        activity_date: activityDate || undefined,
      });
      reset();
      onSuccess();
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan aktivitas.');
    }
  }, [placeName, startTime, endTime, kind, description, locationLabel, mapsLink, activityDate, createActivity, reset, onSuccess]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Aktivitas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Time */}
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.label}>Mulai</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor={colors.mutedLight}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={styles.timeField}>
                <Text style={styles.label}>Selesai</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10:00"
                  placeholderTextColor={colors.mutedLight}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Nama Aktivitas <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Pantai Tiga Warna"
                placeholderTextColor={colors.mutedLight}
                value={placeName}
                onChangeText={setPlaceName}
              />
            </View>

            {/* Kind */}
            <View style={styles.field}>
              <Text style={styles.label}>Jenis</Text>
              <View style={styles.kindRow}>
                {KIND_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.kindChip, kind === opt.value && styles.kindChipActive]}
                    onPress={() => setKind(opt.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.kindEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.kindLabel, kind === opt.value && styles.kindLabelActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.field}>
              <Text style={styles.label}>Lokasi</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama tempat atau alamat"
                placeholderTextColor={colors.mutedLight}
                value={locationLabel}
                onChangeText={setLocationLabel}
              />
            </View>

            {/* Google Maps */}
            <View style={styles.field}>
              <Text style={styles.label}>Google Maps</Text>
              <TextInput
                style={styles.input}
                placeholder="Tempel link Google Maps..."
                placeholderTextColor={colors.mutedLight}
                value={mapsLink}
                onChangeText={setMapsLink}
                autoCapitalize="none"
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Catatan tambahan..."
                placeholderTextColor={colors.mutedLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, createActivity.isPending && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={createActivity.isPending}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>
                {createActivity.isPending ? 'Menyimpan...' : 'Simpan Aktivitas'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    paddingTop: 8,
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  required: {
    color: colors.coral,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
    gap: 6,
  },
  kindRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.light,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  kindChipActive: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  kindEmoji: {
    fontSize: 14,
  },
  kindLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  kindLabelActive: {
    color: colors.coral,
  },
  footer: {
    padding: 20,
    paddingTop: 8,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 6,
  },
  submitBtnDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
  },
  submitText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
