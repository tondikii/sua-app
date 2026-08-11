import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TripActivity, RefLink, CoverSource } from '@atur-perjalanan/shared-types';
import { useCreateActivity } from '@/features/activities/hooks/useCreateActivity';
import { useUpdateActivity } from '@/features/activities/hooks/useUpdateActivity';
import { useSyncMapsThumbnail } from '@/features/activities/hooks/useSyncMapsThumbnail';
import { ActivityCoverPickerSheet, type CoverSelection } from './ActivityCoverPickerSheet';
import { getCoverIconMeta } from '@/features/itinerary/utils/coverIcons';
import { TimePicker } from '@/components/TimePicker';
import { X } from '@/components/icons/X';
import { MapPin } from '@/components/icons/MapPin';
import { Navigation } from '@/components/icons/Navigation';
import { Link2 } from '@/components/icons/Link2';
import { AlertCircle } from '@/components/icons/AlertCircle';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { bottomSheetFrame } from '@/theme/layout';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as Record<string, unknown> : {};

interface Props {
  visible: boolean;
  tripId: string;
  activityDate: string;
  dayNumber?: number;
  editActivity?: TripActivity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActivityFormSheet({
  visible,
  tripId,
  activityDate,
  dayNumber = 1,
  editActivity,
  onClose,
  onSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const createActivity = useCreateActivity(tripId);
  const updateActivity = useUpdateActivity(tripId, editActivity?.id ?? '');
  const syncMaps = useSyncMapsThumbnail(tripId);

  const [placeName, setPlaceName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [refLinks, setRefLinks] = useState<RefLink[]>([{ url: '', label: '' }]);
  const [coverSource, setCoverSource] = useState<CoverSource>('none');
  const [coverIcon, setCoverIcon] = useState<string | null>(null);
  const [coverThumb, setCoverThumb] = useState<string | null>(null);
  const [coverDocumentId, setCoverDocumentId] = useState<string | null>(null);
  const [titleError, setTitleError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  useEffect(() => {
    if (editActivity) {
      setPlaceName(editActivity.place_name);
      setStartTime(editActivity.start_time);
      setEndTime(editActivity.end_time);
      setDescription(editActivity.description ?? '');
      setLocationLabel(editActivity.location_label ?? '');
      setMapsLink(editActivity.maps_link ?? '');
      setRefLinks(editActivity.ref_links.length > 0
        ? editActivity.ref_links.map((r) => ({ url: r.url, label: r.label ?? '' }))
        : [{ url: '', label: '' }]);
      setCoverSource(editActivity.cover_source ?? 'none');
      setCoverIcon(editActivity.cover_icon);
      setCoverThumb(editActivity.thumbnail_url);
      setCoverDocumentId(editActivity.cover_document_id);
      setTitleError('');
    } else {
      setPlaceName('');
      setStartTime('09:00');
      setEndTime('10:00');
      setDescription('');
      setLocationLabel('');
      setMapsLink('');
      setRefLinks([{ url: '', label: '' }]);
      setCoverSource('none');
      setCoverIcon(null);
      setCoverThumb(null);
      setCoverDocumentId(null);
      setTitleError('');
    }
  }, [editActivity, visible]);

  const mutation = editActivity ? updateActivity : createActivity;

  const handleSubmit = useCallback(async () => {
    if (!placeName.trim()) {
      setTitleError('Nama aktivitas wajib diisi');
      return;
    }
    setTitleError('');
    try {
      const filledRefLinks = refLinks
        .map((r) => {
          const url = r.url.trim();
          const label = r.label?.trim();
          return label ? { url, label } : { url };
        })
        .filter((r) => r.url.length > 0);
      const payload = {
        place_name: placeName.trim(),
        day_number: dayNumber,
        start_time: startTime,
        end_time: endTime,
        kind: 'activity' as const,
        description: description.trim() || undefined,
        location_label: locationLabel.trim() || undefined,
        maps_link: mapsLink.trim() || undefined,
        ref_links: filledRefLinks.length > 0 ? filledRefLinks : undefined,
        cover_source: coverSource,
        ...(coverIcon ? { cover_icon: coverIcon } : {}),
        ...(coverDocumentId ? { cover_document_id: coverDocumentId } : {}),
        ...(coverThumb ? { thumbnail_url: coverThumb } : {}),
      };
      if (editActivity) {
        await updateActivity.mutateAsync(payload);
      } else {
        await createActivity.mutateAsync(payload);
      }
      onSuccess();
    } catch {
      setTitleError('Terjadi kesalahan');
    }
  }, [placeName, startTime, endTime, description, locationLabel, mapsLink, refLinks, coverSource, coverIcon, coverThumb, coverDocumentId, dayNumber, editActivity, createActivity, updateActivity, onSuccess]);

  const updateRefLink = useCallback((index: number, patch: Partial<RefLink>) => {
    setRefLinks((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }, []);

  const addRefLink = useCallback(() => {
    setRefLinks((prev) => [...prev, { url: '', label: '' }]);
  }, []);

  const removeRefLink = useCallback((index: number) => {
    setRefLinks((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  const handleCoverSelect = useCallback((selection: CoverSelection) => {
    setCoverSource(selection.cover_source);
    setCoverIcon(selection.cover_icon ?? null);
    setCoverThumb(selection.thumbnail_url ?? null);
    setCoverDocumentId(selection.cover_document_id ?? null);
  }, []);

  const iconMeta = getCoverIconMeta(coverIcon);
  const Icon = iconMeta.icon;
  const hasCover = coverSource !== 'none';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{editActivity ? 'Edit Aktivitas' : 'Tambah Aktivitas'}</Text>
              <Text style={styles.subtitle}>{activityDate || 'Tanggal belum ditentukan'}</Text>
            </View>
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
            {/* Mulai / Selesai */}
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.label}>Mulai</Text>
                <TouchableOpacity
                  style={[styles.timeBox, focusedField === 'start' && styles.timeBoxFocused]}
                  onPress={() => { setShowStartPicker(true); setShowEndPicker(false); setFocusedField('start'); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{startTime}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeField}>
                <Text style={styles.label}>Selesai</Text>
                <TouchableOpacity
                  style={[styles.timeBox, focusedField === 'end' && styles.timeBoxFocused]}
                  onPress={() => { setShowEndPicker(true); setShowStartPicker(false); setFocusedField('end'); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{endTime}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TimePicker
              visible={showStartPicker}
              value={startTime}
              onChange={(t) => { setStartTime(t); setShowStartPicker(false); setFocusedField(null); }}
              onClose={() => setShowStartPicker(false)}
            />
            <TimePicker
              visible={showEndPicker}
              value={endTime}
              onChange={(t) => { setEndTime(t); setShowEndPicker(false); setFocusedField(null); }}
              onClose={() => setShowEndPicker(false)}
            />

            {/* Nama */}
            <View style={styles.field}>
              <Text style={styles.label}>Nama Aktivitas <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputRow, focusedField === 'name' && styles.inputFocused, titleError && styles.inputError]}>
                <TextInput
                  style={styles.inputInner}
                  placeholder="Contoh: Pantai Tiga Warna"
                  placeholderTextColor={colors.mutedLight}
                  value={placeName}
                  onChangeText={(t) => { setPlaceName(t); if (titleError) setTitleError(''); }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                {titleError ? <AlertCircle size={17} color={colors.danger} /> : null}
              </View>
              {titleError ? (
                <View style={styles.errorRow}>
                  <AlertCircle size={12} color={colors.danger} />
                  <Text style={styles.errorText}>{titleError}</Text>
                </View>
              ) : null}
            </View>

            {/* Cover */}
            <View style={styles.field}>
              <Text style={styles.label}>Cover</Text>
              <TouchableOpacity
                style={styles.coverRow}
                onPress={() => setShowCoverPicker(true)}
                activeOpacity={0.7}
              >
                {hasCover && coverThumb ? (
                  <Image source={{ uri: coverThumb }} style={styles.coverThumb} resizeMode="cover" />
                ) : hasCover && coverIcon ? (
                  <View style={[styles.coverThumb, styles.coverIconThumb, { backgroundColor: iconMeta.bg }]}>
                    <Icon size={20} color={iconMeta.color} />
                  </View>
                ) : (
                  <View style={[styles.coverThumb, styles.coverEmpty]}>
                    <MapPin size={20} color={colors.mutedLight} />
                  </View>
                )}
                <View style={styles.coverInfo}>
                  <Text style={styles.coverLabel}>
                    {hasCover ? (coverSource === 'maps' ? 'Google Maps' : coverSource === 'icon' ? 'Icon' : 'Media perjalanan') : 'Belum dipilih'}
                  </Text>
                  <Text style={styles.coverAction}>{hasCover ? 'Ubah' : 'Pilih'}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.coverActions}>
                <TouchableOpacity onPress={() => setShowCoverPicker(true)} activeOpacity={0.7}>
                  <Text style={styles.coverActionText}>{hasCover ? 'Ubah' : 'Pilih'}</Text>
                </TouchableOpacity>
                {hasCover && (
                  <>
                    <Text style={styles.coverActionDivider}>·</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setCoverSource('none');
                        setCoverIcon(null);
                        setCoverThumb(null);
                        setCoverDocumentId(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.coverActionText}>Hapus</Text>
                    </TouchableOpacity>
                  </>
                )}
                {mapsLink.trim().length > 0 && (
                  <>
                    <Text style={styles.coverActionDivider}>·</Text>
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          const res = await syncMaps.mutateAsync({ maps_link: mapsLink.trim() });
                          if (res.thumbnail_url) {
                            setCoverSource('maps');
                            setCoverThumb(res.thumbnail_url);
                          }
                        } catch {
                          // ignore — thumbnail resolution may fail silently
                        }
                      }}
                      activeOpacity={0.7}
                      disabled={syncMaps.isPending}
                    >
                      <Text style={[styles.coverActionText, { color: colors.muted }]}>
                        {syncMaps.isPending ? 'Menyinkronkan...' : 'Sinkron Maps'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Google Maps */}
            <View style={styles.field}>
              <Text style={styles.label}>Google Maps</Text>
              <View style={[styles.inputRow, focusedField === 'maps' && styles.inputFocused]}>
                <Navigation size={16} color={mapsLink ? colors.teal : colors.mutedLight} />
                <TextInput
                  style={styles.inputInner}
                  placeholder="Tempel link Google Maps..."
                  placeholderTextColor={colors.mutedLight}
                  value={mapsLink}
                  onChangeText={setMapsLink}
                  onFocus={() => setFocusedField('maps')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>
            </View>

            {/* Link Lainnya */}
            <View style={styles.field}>
              <Text style={styles.label}>Link Lainnya</Text>
              {refLinks.map((ref, index) => (
                <View key={index} style={styles.refLinkGroup}>
                  {refLinks.length > 1 && <Text style={styles.refLinkIndex}>Link {index + 1}</Text>}
                  <Text style={styles.refLinkSubLabel}>URL</Text>
                  <View style={[styles.inputRow, focusedField === `refUrl-${index}` && styles.inputFocused]}>
                    <Link2 size={16} color={colors.mutedLight} />
                    <TextInput
                      style={styles.inputInner}
                      placeholder="Tempel link referensi..."
                      placeholderTextColor={colors.mutedLight}
                      value={ref.url}
                      onChangeText={(t) => updateRefLink(index, { url: t })}
                      onFocus={() => setFocusedField(`refUrl-${index}`)}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                    />
                    {refLinks.length > 1 && (
                      <TouchableOpacity onPress={() => removeRefLink(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <X size={14} color={colors.muted} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {ref.url.trim().length > 0 && (
                    <>
                      <Text style={styles.refLinkSubLabel}>Judul tampilan</Text>
                      <TextInput
                        style={[styles.input, focusedField === `refLabel-${index}` && styles.inputFocused]}
                        placeholder="Kosongkan untuk tampilkan URL"
                        placeholderTextColor={colors.mutedLight}
                        value={ref.label}
                        onChangeText={(t) => updateRefLink(index, { label: t })}
                        onFocus={() => setFocusedField(`refLabel-${index}`)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addLinkBtn} onPress={addRefLink} activeOpacity={0.7}>
                <Text style={styles.addLinkBtnText}>+ Tambah link</Text>
              </TouchableOpacity>
            </View>

            {/* Lokasi */}
            <View style={styles.field}>
              <Text style={styles.label}>Lokasi</Text>
              <View style={[styles.inputRow, focusedField === 'location' && styles.inputFocused]}>
                <MapPin size={16} color={locationLabel ? colors.coral : colors.mutedLight} />
                <TextInput
                  style={styles.inputInner}
                  placeholder="Nama tempat atau alamat"
                  placeholderTextColor={colors.mutedLight}
                  value={locationLabel}
                  onChangeText={setLocationLabel}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Deskripsi */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={[styles.input, styles.textArea, focusedField === 'desc' && styles.inputFocused]}
                placeholder="Catatan tambahan..."
                placeholderTextColor={colors.mutedLight}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedField('desc')}
                onBlur={() => setFocusedField(null)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, mutation.isPending && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={mutation.isPending}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>
                {mutation.isPending ? 'Menyimpan...' : editActivity ? 'Simpan Perubahan' : 'Simpan Aktivitas'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ActivityCoverPickerSheet
        visible={showCoverPicker}
        tripId={tripId}
        onClose={() => setShowCoverPicker(false)}
        onSelect={handleCoverSelect}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    ...bottomSheetFrame,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingTop: 12, gap: 14, paddingBottom: 32 },
  field: { gap: 6 },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  required: { color: colors.coral },
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
    ...webOutlineNone,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...webOutlineNone,
  },
  inputInner: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
    padding: 0,
    ...webOutlineNone,
  },
  inputFocused: { borderColor: colors.coral, borderWidth: 2 },
  inputError: { borderColor: colors.danger, borderWidth: 2, backgroundColor: colors.dangerLight },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2, paddingLeft: 2 },
  errorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.danger,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  timeRow: { flexDirection: 'row', gap: 12 },
  timeField: { flex: 1, gap: 6 },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  timeBoxFocused: { borderColor: colors.coral, borderWidth: 2 },
  timeValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  coverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.light,
  },
  coverThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverIconThumb: { alignItems: 'center', justifyContent: 'center' },
  coverEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverInfo: { flex: 1, gap: 4 },
  coverLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  coverAction: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  coverActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  coverActionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  coverActionDivider: {
    fontSize: 12,
    color: colors.border,
  },
  refLinkGroup: { flexDirection: 'column', gap: 8, marginBottom: 10 },
  refLinkIndex: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  refLinkSubLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  addLinkBtn: { paddingVertical: 4 },
  addLinkBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  footer: {
    padding: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  submitBtnDisabled: { backgroundColor: colors.disabled, shadowOpacity: 0 },
  submitText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
