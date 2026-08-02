import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { useUpdateTrip } from '@/features/trips/hooks/useUpdateTrip';
import { useToast } from '@/components/Toast';
import { TagInput } from '@/components/TagInput';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { TimePicker } from '@/components/TimePicker';
import { X } from '@/components/icons/X';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

const WEEK_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function formatDateISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDateISO(dateStr: string | null) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

/** Same shell as Buat Perjalanan (Screen 103 — Edit Perjalanan). */
export default function EditTripScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { data: trip, isLoading } = useTripDetail(tripId);
  const updateTrip = useUpdateTrip(tripId);

  const parsedStart = parseDateISO(trip?.start_date ?? null);
  const parsedEnd = parseDateISO(trip?.end_date ?? null);

  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [calYear, setCalYear] = useState(parsedStart?.year ?? new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(parsedStart?.month ?? new Date().getMonth());
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Hydrate from trip detail once loaded.
  const [hydrated, setHydrated] = useState(false);
  if (trip && !hydrated) {
    setName(trip.name);
    setTags(trip.tags ?? []);
    setAllDay(trip.is_all_day ?? true);
    setStartTime(trip.start_time ?? '08:00');
    setEndTime(trip.end_time ?? '17:00');
    if (trip.start_date && trip.end_date) {
      setDateRange({ startDate: trip.start_date, endDate: trip.end_date });
    }
    setCalYear(parsedStart?.year ?? new Date().getFullYear());
    setCalMonth(parsedStart?.month ?? new Date().getMonth());
    setHydrated(true);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [daysInMonth, firstDay]);

  const addTag = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const tag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleDayPress = useCallback((day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    if (!dateRange) {
      setDateRange({ startDate: iso, endDate: iso });
      setSelectingEnd(true);
    } else if (selectingEnd) {
      setDateRange({
        startDate: dateRange.startDate,
        endDate: iso >= dateRange.startDate ? iso : dateRange.startDate,
      });
      setSelectingEnd(false);
    } else {
      setDateRange({ startDate: iso, endDate: iso });
      setSelectingEnd(true);
    }
  }, [calYear, calMonth, dateRange, selectingEnd]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      showToast('Nama perjalanan wajib diisi');
      return;
    }
    if (!dateRange) {
      showToast('Pilih rentang tanggal perjalanan.');
      return;
    }
    setSaving(true);
    try {
      await updateTrip.mutateAsync({
        name: name.trim(),
        tags: tags.length > 0 ? tags : undefined,
        start_date: dateRange.startDate + 'T00:00:00.000Z',
        end_date: dateRange.endDate + 'T00:00:00.000Z',
        is_all_day: allDay,
        start_time: allDay ? undefined : startTime,
        end_time: allDay ? undefined : endTime,
      });
      goBack();
    } catch {
      showToast('Tidak dapat menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  }, [name, tags, dateRange, allDay, startTime, endTime, updateTrip, showToast]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/trip/${tripId}`);
    }
  }, [router, tripId]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
        </View>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Perjalanan tidak ditemukan</Text>
        </View>
      </View>
    );
  }

  const isDaySelected = (day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    return dateRange ? iso === dateRange.startDate || iso === dateRange.endDate : false;
  };

  const isDayInRange = (day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    return dateRange ? iso > dateRange.startDate && iso < dateRange.endDate : false;
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header — CreateTripModalHeader (Screen 103) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
          <X size={18} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Perjalanan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nama Perjalanan */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Nama Perjalanan <Text style={styles.required}>*</Text>
          </Text>
          <FocusedTextInput
            style={styles.input}
            placeholder="Masukkan nama perjalanan..."
            placeholderTextColor={colors.mutedLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Tags */}
        <View style={styles.field}>
          <Text style={styles.label}>Tag</Text>
          <TagInput tags={tags} onAdd={addTag} onRemove={removeTag} />
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calHeader}>
            <TouchableOpacity
              style={styles.calNavBtn}
              onPress={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                else setCalMonth(calMonth - 1);
              }}
            >
              <ChevronLeft size={16} color={colors.charcoal} />
            </TouchableOpacity>
            <Text style={styles.calMonthLabel}>{MONTH_NAMES[calMonth]} {calYear}</Text>
            <TouchableOpacity
              style={styles.calNavBtn}
              onPress={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                else setCalMonth(calMonth + 1);
              }}
            >
              <View style={{ transform: [{ scaleX: -1 }] }}>
                <ChevronLeft size={16} color={colors.charcoal} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.calWeekDays}>
            {WEEK_DAYS.map((d) => (
              <Text key={d} style={styles.calWeekDay}>{d}</Text>
            ))}
          </View>

          <View style={styles.calGrid}>
            {calendarDays.map((day, i) => {
              if (day === null) return <View key={`empty-${i}`} style={styles.calDayCell} />;
              const selected = isDaySelected(day);
              const inRange = isDayInRange(day);
              return (
                <TouchableOpacity key={day} style={styles.calDayCell} onPress={() => handleDayPress(day)} activeOpacity={0.7}>
                  <View style={[styles.calDay, selected && styles.calDaySelected, inRange && styles.calDayInRange]}>
                    <Text style={[styles.calDayText, selected && styles.calDayTextSelected, inRange && styles.calDayTextInRange]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Waktu */}
        <View style={styles.field}>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>Waktu</Text>
            <View style={styles.toggleRight}>
              <Text style={[styles.allDayLabel, allDay && styles.allDayLabelActive]}>Sepanjang hari</Text>
              <Switch
                value={allDay}
                onValueChange={(v) => { setAllDay(v); if (!v) setShowStartPicker(false); }}
                trackColor={{ false: colors.border, true: colors.coralLight }}
                thumbColor={allDay ? colors.coral : colors.muted}
              />
            </View>
          </View>
          {!allDay && (
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Mulai</Text>
                <TouchableOpacity
                  style={[styles.timeInputBox, focusedField === 'startTime' && styles.timeInputBoxFocused]}
                  onPress={() => { setShowStartPicker(true); setShowEndPicker(false); setFocusedField('startTime'); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{startTime}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <TimePicker
                    value={startTime}
                    onChange={(t) => { setStartTime(t); setShowStartPicker(false); setFocusedField(null); }}
                    onClose={() => { setShowStartPicker(false); setFocusedField(null); }}
                  />
                )}
              </View>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Selesai</Text>
                <TouchableOpacity
                  style={[styles.timeInputBox, focusedField === 'endTime' && styles.timeInputBoxFocused]}
                  onPress={() => { setShowEndPicker(true); setShowStartPicker(false); setFocusedField('endTime'); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeValue}>{endTime}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <TimePicker
                    value={endTime}
                    onChange={(t) => { setEndTime(t); setShowEndPicker(false); setFocusedField(null); }}
                    onClose={() => { setShowEndPicker(false); setFocusedField(null); }}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer — CreateTripFooter label "Simpan" */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.submitButton, (saving || updateTrip.isPending) && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving || updateTrip.isPending}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>
            {saving || updateTrip.isPending ? 'Menyimpan...' : 'Simpan'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...typography.body, color: colors.muted },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
  },
  headerSpacer: { width: 36 },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 40, gap: 14 },
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
  },
  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  calWeekDays: { flexDirection: 'row', marginBottom: 4 },
  calWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 2 },
  calDay: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDaySelected: {
    backgroundColor: colors.coral,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  calDayInRange: { backgroundColor: colors.coralLight },
  calDayText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  calDayTextSelected: {
    color: colors.white,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  calDayTextInRange: {
    color: colors.coral,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  allDayLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  allDayLabelActive: { color: colors.coral },
  timeRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  timeField: { flex: 1, gap: 6 },
  timeLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  timeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 11,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  timeInputBoxFocused: {
    borderColor: colors.coral,
    borderWidth: 2,
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  submitButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
});
