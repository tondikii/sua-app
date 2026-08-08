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
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateTrip } from '@/features/trips/hooks/useCreateTrip';
import { useConvertToTrip } from '@/features/wishlist/hooks/useConvertToTrip';
import { InviteBottomSheet } from '@/features/invitations/components/InviteBottomSheet';
import { goBackSmart } from '@/lib/navigation';
import { useToast } from '@/components/Toast';
import { TagInput } from '@/components/TagInput';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { X } from '@/components/icons/X';
import { Plus } from '@/components/icons/Plus';
import { Info } from '@/components/icons/Info';
import { Calendar } from '@/components/icons/Calendar';
import { Clock } from '@/components/icons/Clock';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { TimePicker } from '@/components/TimePicker';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

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

function parseDateISO(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

/** "12 – 15 Jun 2026" or "28 – 2 Jul 2026" when the range crosses months. */
function formatDateRange(start: string, end: string) {
  const s = parseDateISO(start);
  const e = parseDateISO(end);
  if (s.month === e.month && s.year === e.year) {
    return `${s.day} – ${e.day} ${MONTH_NAMES[e.month]} ${e.year}`;
  }
  return `${s.day} ${MONTH_NAMES[s.month]} – ${e.day} ${MONTH_NAMES[e.month]} ${e.year}`;
}

/** "15 Agustus 2026 · 20:00" from an ISO datetime string (YYYY-MM-DDTHH:mm:ss.000Z). */
function formatVotingDeadline(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm}`;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface Candidate extends DateRange {
  id: string;
}

export default function CreateTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createTrip = useCreateTrip();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{
    wishlistId?: string;
    name?: string;
    tags?: string;
    start?: string;
    end?: string;
    location?: string;
    thumb?: string;
  }>();
  const convertToTrip = useConvertToTrip(params.wishlistId ?? '');

  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const [name, setName] = useState(params.name ?? '');
  const [tags, setTags] = useState<string[]>(
    params.tags ? params.tags.split(',').filter(Boolean) : [],
  );
  // When the wishlist carries times, prefill them and disable "all day".
  const [allDay, setAllDay] = useState(!(params.start && params.end));
  const [startTime, setStartTime] = useState(params.start ?? '08:00');
  const [endTime, setEndTime] = useState(params.end ?? '17:00');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calendar state — initial selected = today
  const today = new Date();
  const initialStartDate = formatDateISO(today.getFullYear(), today.getMonth(), today.getDate());
  const initialEndDate = formatDateISO(today.getFullYear(), today.getMonth(), today.getDate());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  // Mode A: direct date range
  const [dateRange, setDateRange] = useState<DateRange | null>({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [selectingEnd, setSelectingEnd] = useState(false);

  // Mode B: candidates
  const [candidateMode, setCandidateMode] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<DateRange | null>(null);
  const [candidateSelectingEnd, setCandidateSelectingEnd] = useState(false);
  const [candidateInfoOpen, setCandidateInfoOpen] = useState(false);
  const [votingDeadline, setVotingDeadline] = useState('');
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  // Deadline picker calendar state
  const [dlMonth, setDlMonth] = useState(today.getMonth());
  const [dlYear, setDlYear] = useState(today.getFullYear());
  const [dlTime, setDlTime] = useState('20:00');

  // Validation
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Calendar grid
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [daysInMonth, firstDay]);

  const prevMonth = useCallback(() => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  }, [calMonth, calYear]);

  const nextMonth = useCallback(() => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  }, [calMonth, calYear]);

  const handleDayPress = useCallback((day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    // Clear date error on new selection
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));

    if (candidateMode) {
      if (!activeCandidate) {
        // Start selecting a new candidate
        setActiveCandidate({ startDate: iso, endDate: iso });
        setCandidateSelectingEnd(true);
      } else if (candidateSelectingEnd) {
        // Extend active candidate with an end date — not saved yet, still active
        // until the highlighted "Tambah Kandidat Tanggal" button confirms it.
        const start = activeCandidate.startDate;
        setActiveCandidate({ startDate: start, endDate: iso >= start ? iso : start });
        setCandidateSelectingEnd(false);
      } else {
        // Restart: tap again to pick new start
        setActiveCandidate({ startDate: iso, endDate: iso });
        setCandidateSelectingEnd(true);
      }
    } else {
      // Mode A: direct range
      if (!dateRange) {
        // First selection — set start date
        setDateRange({ startDate: iso, endDate: iso });
        setSelectingEnd(true);
      } else if (selectingEnd) {
        // Second selection — set end date
        const start = dateRange.startDate;
        setDateRange({
          startDate: start,
          endDate: iso >= start ? iso : start,
        });
        setSelectingEnd(false);
      } else {
        // Restart selection
        setDateRange({ startDate: iso, endDate: iso });
        setSelectingEnd(true);
      }
    }
  }, [calYear, calMonth, candidateMode, activeCandidate, candidateSelectingEnd, dateRange, selectingEnd, errors.date]);

  const saveActiveCandidate = useCallback(() => {
    if (!activeCandidate) return;
    const newCandidate: Candidate = {
      id: `c${Date.now()}`,
      startDate: activeCandidate.startDate,
      endDate: activeCandidate.endDate,
    };
    setCandidates((prev) => [...prev, newCandidate]);
    setActiveCandidate(null);
    setCandidateSelectingEnd(false);
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
  }, [activeCandidate, errors.date]);

  const switchToCandidateMode = useCallback(() => {
    if (!candidateMode) {
      setCandidateMode(true);
      // The range already selected in Mode A becomes the first candidate.
      if (dateRange) {
        setCandidates((prev) => [
          ...prev,
          { id: `c${Date.now()}`, startDate: dateRange.startDate, endDate: dateRange.endDate },
        ]);
      }
      setDateRange(null);
      setSelectingEnd(false);
    }
  }, [candidateMode, dateRange]);

  const removeCandidate = useCallback((id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addTag = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const tag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, [tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nama perjalanan tidak boleh kosong.';
    if (candidateMode) {
      if (candidates.length === 0) newErrors.date = 'Pilih minimal 1 kandidat tanggal';
    } else {
      if (!dateRange) newErrors.date = 'Pilih rentang tanggal perjalanan.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, candidateMode, candidates, dateRange]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);
    if (!validate()) return;

    try {
      if (candidateMode && candidates.length > 0) {
        // Candidate mode isn't supported for wishlist conversion — treat like normal create.
        const payload = {
          name: name.trim(),
          tags: tags.length > 0 ? tags : undefined,
          candidates: candidates.map((c) => ({
            start_date: c.startDate + 'T00:00:00.000Z',
            end_date: c.endDate + 'T00:00:00.000Z',
          })),
          voting_deadline: votingDeadline || undefined,
        };
        const trip = await createTrip.mutateAsync(payload);
        setCreatedTripId(trip.id);
        setShowInvite(true);
        return;
      }

      if (!dateRange) return;

      // Wishlist conversion: call the atomic convert-to-trip endpoint which
      // pre-fills trip name/tags/time from the wishlist, seeds the activity as
      // the first itinerary item, and soft-deletes the wishlist.
      if (params.wishlistId) {
        const trip = await convertToTrip.mutateAsync({
          trip_name: name.trim(),
          tags: tags.length > 0 ? tags : undefined,
          start_date: dateRange.startDate + 'T00:00:00.000Z',
          end_date: dateRange.endDate + 'T00:00:00.000Z',
          is_all_day: allDay,
          start_time: allDay ? undefined : startTime,
          end_time: allDay ? undefined : endTime,
        });
        setCreatedTripId(trip.id);
        setShowInvite(true);
        showToast('Perjalanan berhasil dibuat', {
          type: 'success',
          submessage: 'Kamu bisa mulai undang teman sekarang.',
        });
        return;
      }

      const payload = {
        name: name.trim(),
        tags: tags.length > 0 ? tags : undefined,
        start_date: dateRange.startDate + 'T00:00:00.000Z',
        end_date: dateRange.endDate + 'T00:00:00.000Z',
        is_all_day: allDay,
        start_time: allDay ? undefined : startTime,
        end_time: allDay ? undefined : endTime,
      };

      const trip = await createTrip.mutateAsync(payload);
      setCreatedTripId(trip.id);
      setShowInvite(true);
      showToast('Perjalanan berhasil dibuat', {
        type: 'success',
        submessage: 'Kamu bisa mulai undang teman sekarang.',
      });
    } catch (err) {
      showToast('Terjadi kesalahan saat membuat perjalanan.');
    }
  }, [validate, candidateMode, candidates, dateRange, name, tags, allDay, startTime, endTime, votingDeadline, createTrip, convertToTrip, params.wishlistId, showToast]);

  const isDaySelected = useCallback((day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    if (candidateMode) {
      if (activeCandidate && (iso === activeCandidate.startDate || iso === activeCandidate.endDate)) return true;
      return candidates.some((c) => iso === c.startDate || iso === c.endDate);
    }
    if (dateRange) {
      return iso === dateRange.startDate || iso === dateRange.endDate;
    }
    return false;
  }, [calYear, calMonth, candidateMode, activeCandidate, candidates, dateRange]);

  const isDayInRangeHighlight = useCallback((day: number) => {
    const iso = formatDateISO(calYear, calMonth, day);
    if (candidateMode) {
      if (activeCandidate && iso > activeCandidate.startDate && iso < activeCandidate.endDate) return true;
      return candidates.some((c) => iso > c.startDate && iso < c.endDate);
    }
    if (dateRange && iso > dateRange.startDate && iso < dateRange.endDate) return true;
    return false;
  }, [calYear, calMonth, candidateMode, activeCandidate, candidates, dateRange]);

  const hasValidationErrors = useMemo(() => {
    if (!name.trim()) return true;
    if (candidateMode && candidates.length === 0) return true;
    if (!candidateMode && !dateRange) return true;
    return false;
  }, [name, candidateMode, candidates, dateRange]);

  const submitDisabled = createTrip.isPending || convertToTrip.isPending || (submitted && hasValidationErrors);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.closeButton}>
          <X size={18} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Perjalanan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Trip Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Nama Perjalanan <Text style={styles.required}>*</Text>
          </Text>
          <FocusedTextInput
            style={[styles.input, submitted && errors.name && styles.inputError]}
            placeholder="Masukkan nama perjalanan..."
            placeholderTextColor={colors.mutedLight}
            value={name}
            onChangeText={(t) => { setName(t); if (errors.name) setErrors((prev) => ({ ...prev, name: undefined })); }}
          />
          {submitted && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        {/* Tags */}
        <View style={styles.field}>
          <Text style={styles.label}>Tag</Text>
          <TagInput tags={tags} onAdd={addTag} onRemove={removeTag} />
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
              <ChevronLeft size={16} color={colors.charcoal} />
            </TouchableOpacity>
            <Text style={styles.calMonthLabel}>
              {MONTH_NAMES[calMonth]} {calYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
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
              const inRange = isDayInRangeHighlight(day);
              const isSunday = new Date(calYear, calMonth, day).getDay() === 0;

              return (
                <TouchableOpacity
                  key={day}
                  style={styles.calDayCell}
                  onPress={() => handleDayPress(day)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.calDay,
                    selected && styles.calDaySelected,
                    inRange && styles.calDayInRange,
                  ]}>
                    <Text style={[
                      styles.calDayText,
                      isSunday && !selected && { color: colors.muted },
                      selected && styles.calDayTextSelected,
                      inRange && styles.calDayTextInRange,
                    ]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {submitted && errors.date && (
            <Text style={[styles.errorText, { marginTop: 8 }]}>{errors.date}</Text>
          )}
        </View>

        {/* Time Fields (Mode A only) */}
        {!candidateMode && (
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
                  <TimePicker
                    visible={showStartPicker}
                    value={startTime}
                    onChange={(t) => { setStartTime(t); setShowStartPicker(false); setFocusedField(null); }}
                    onClose={() => { setShowStartPicker(false); setFocusedField(null); }}
                  />
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
                  <TimePicker
                    visible={showEndPicker}
                    value={endTime}
                    onChange={(t) => { setEndTime(t); setShowEndPicker(false); setFocusedField(null); }}
                    onClose={() => { setShowEndPicker(false); setFocusedField(null); }}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Candidate Mode Toggle */}
        {!candidateMode && (
          <View>
            {candidateInfoOpen && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>
                  Tambahkan kandidat tanggal jika tanggal belum pasti. Kandidat tanggal
                  akan menjadi voting di detail perjalanan.
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.addCandidateButton}
              onPress={switchToCandidateMode}
              activeOpacity={0.7}
            >
              <Plus size={16} color={colors.coral} />
              <Text style={styles.addCandidateText}>Tambah Kandidat Tanggal</Text>
              <TouchableOpacity
                onPress={() => setCandidateInfoOpen((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Info size={15} color={colors.coral} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Candidate List */}
        {candidateMode && (
          <View style={styles.field}>
            <Text style={styles.label}>
              Kandidat Tanggal{' '}
              {candidates.length > 0 && (
                <Text style={styles.labelHint}>{candidates.length} tersimpan</Text>
              )}
            </Text>
            {candidates.map((c, i) => (
              <View key={c.id} style={styles.candidateRow}>
                <View style={styles.candidateBadge}>
                  <Text style={styles.candidateBadgeText}>{i + 1}</Text>
                </View>
                <Text style={styles.candidateDate}>{formatDateRange(c.startDate, c.endDate)}</Text>
                <TouchableOpacity onPress={() => removeCandidate(c.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={14} color={colors.muted} />
                </TouchableOpacity>
              </View>
            ))}

            {activeCandidate && (
              <View style={[styles.candidateRow, styles.candidateRowActive]}>
                <View style={[styles.candidateBadge, styles.candidateBadgeActive]}>
                  <Text style={[styles.candidateBadgeText, styles.candidateBadgeTextActive]}>
                    {candidates.length + 1}
                  </Text>
                </View>
                <Text style={styles.candidateDateActive}>
                  {candidateSelectingEnd
                    ? `${formatDateRange(activeCandidate.startDate, activeCandidate.startDate)} — Pilih akhir`
                    : formatDateRange(activeCandidate.startDate, activeCandidate.endDate)}
                </Text>
              </View>
            )}

            {candidates.length < 3 && (
              <TouchableOpacity
                style={[styles.addCandidateButton, styles.addCandidateHighlighted]}
                onPress={() => {
                  if (activeCandidate) {
                    // Confirm and save the active (coral) candidate.
                    saveActiveCandidate();
                  } else {
                    // Start selecting a new candidate on the calendar.
                    setActiveCandidate(null);
                    setCandidateSelectingEnd(false);
                  }
                }}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.coral} />
                <Text style={styles.addCandidateText}>
                  {activeCandidate ? 'Simpan Kandidat Tanggal' : 'Tambah Kandidat Tanggal'}
                </Text>
                <Info size={15} color={colors.coral} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Voting Deadline (Mode B) */}
        {candidateMode && candidates.length > 0 && (
          <View style={styles.field}>
            <Text style={styles.label}>Tenggat Voting Tanggal</Text>
            <TouchableOpacity
              style={[styles.deadlineBox]}
              onPress={() => {
                setShowDeadlinePicker((v) => !v);
                setCandidateInfoOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Calendar size={16} color={votingDeadline ? colors.coral : colors.muted} />
              <Text style={[styles.deadlineText, !votingDeadline && styles.deadlinePlaceholder]}>
                {votingDeadline ? formatVotingDeadline(votingDeadline) : 'Pilih tanggal & waktu... (opsional)'}
              </Text>
              {votingDeadline.length > 0 && (
                <TouchableOpacity
                  onPress={() => { setVotingDeadline(''); setShowDeadlinePicker(false); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={colors.muted} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {showDeadlinePicker && (
              <View style={styles.deadlinePicker}>
                <View style={styles.deadlinePickerHeader}>
                  <TouchableOpacity
                    style={styles.deadlinePickerNav}
                    onPress={() => {
                      if (dlMonth === 0) { setDlMonth(11); setDlYear(dlYear - 1); }
                      else setDlMonth(dlMonth - 1);
                    }}
                  >
                    <ChevronLeft size={16} color={colors.charcoal} />
                  </TouchableOpacity>
                  <Text style={styles.deadlinePickerMonth}>
                    {MONTH_NAMES[dlMonth]} {dlYear}
                  </Text>
                  <TouchableOpacity
                    style={styles.deadlinePickerNav}
                    onPress={() => {
                      if (dlMonth === 11) { setDlMonth(0); setDlYear(dlYear + 1); }
                      else setDlMonth(dlMonth + 1);
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
                  {(() => {
                    const days = getDaysInMonth(dlYear, dlMonth);
                    const first = getFirstDayOfWeek(dlYear, dlMonth);
                    const cells: (number | null)[] = [];
                    for (let i = 0; i < first; i++) cells.push(null);
                    for (let d = 1; d <= days; d++) cells.push(d);
                    return cells.map((day, i) => {
                      if (day === null) return <View key={`empty-${i}`} style={styles.calDayCell} />;
                      const iso = formatDateISO(dlYear, dlMonth, day);
                      const selected = votingDeadline.startsWith(iso);
                      return (
                        <TouchableOpacity
                          key={day}
                          style={styles.calDayCell}
                          onPress={() => {
                            setVotingDeadline(`${iso}T${dlTime}:00.000Z`);
                            setShowDeadlinePicker(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.calDay, selected && styles.calDaySelected]}>
                            <Text style={[styles.calDayText, selected && styles.calDayTextSelected]}>
                              {day}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    });
                  })()}
                </View>
                <View style={styles.deadlineTimeRow}>
                  <View style={styles.deadlineTimeField}>
                    <Text style={styles.timeLabel}>Jam</Text>
                    <TouchableOpacity
                      style={[styles.deadlineTimeBox, showStartPicker && styles.timeInputBoxFocused]}
                      onPress={() => {
                        setShowStartPicker(true);
                        setShowEndPicker(false);
                        setFocusedField('startTime');
                      }}
                      activeOpacity={0.7}
                    >
                      <Clock size={14} color={colors.muted} />
                      <Text style={styles.timeValue}>{dlTime}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.deadlineHint}>
                    Tenggat voting dipilih dari kalender. Kosongkan jika voting hanya dikunci manual.
                  </Text>
                </View>
                <TimePicker
                  visible={showStartPicker}
                  value={dlTime}
                  onChange={(t) => { setDlTime(t); setShowStartPicker(false); setFocusedField(null); }}
                  onClose={() => { setShowStartPicker(false); setFocusedField(null); }}
                  startLabel="Jam"
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {submitted && Object.keys(errors).length > 0 && (
          <View style={styles.footerError}>
            <View style={styles.footerErrorIcon}>
              <Text style={styles.footerErrorIconText}>!</Text>
            </View>
            <View style={styles.footerErrorContent}>
              <Text style={styles.footerErrorSummary}>
                {Object.keys(errors).length} hal wajib belum lengkap
              </Text>
              {errors.name && <Text style={styles.footerErrorItem}>{errors.name}</Text>}
              {errors.date && <Text style={styles.footerErrorItem}>{errors.date}</Text>}
            </View>
          </View>
        )}
        <TouchableOpacity
          style={[styles.submitButton, submitDisabled && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitDisabled}
          activeOpacity={0.8}
        >
          {createTrip.isPending || convertToTrip.isPending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.submitText}>
              {createTrip.isPending || convertToTrip.isPending ? 'Membuat...' : 'Buat Perjalanan'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {showInvite && createdTripId && (
        <InviteBottomSheet
          visible={showInvite}
          tripId={createdTripId}
          onClose={() => {
            setShowInvite(false);
            router.replace(`/trip/${createdTripId}`);
          }}
          onEnterTrip={() => {
            setShowInvite(false);
            router.replace(`/trip/${createdTripId}`);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  headerSpacer: {
    width: 36,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 40,
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
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
    backgroundColor: colors.dangerLight,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.danger,
  },
  labelHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  tooltip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
    lineHeight: 16,
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
  calWeekDays: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 2,
  },
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
  calDayInRange: {
    backgroundColor: colors.coralLight,
  },
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
  toggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allDayLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  allDayLabelActive: {
    color: colors.coral,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  timeField: {
    flex: 1,
    gap: 6,
  },
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
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light,
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  deadlineText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  deadlinePlaceholder: {
    color: colors.mutedLight,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  deadlinePicker: {
    marginTop: 8,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  deadlinePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deadlinePickerNav: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlinePickerMonth: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  deadlineTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  deadlineTimeField: {
    flex: 1,
    gap: 6,
  },
  deadlineTimeBox: {
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
  deadlineHint: {
    flex: 1.4,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
    lineHeight: 14,
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  timePickerContainer: {
    marginTop: 10,
    padding: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  timePickerColumns: {
    flexDirection: 'row',
    gap: 8,
  },
  timePickerCol: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerColLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
    marginBottom: 6,
  },
  timePickerList: {
    maxHeight: 140,
    borderRadius: 10,
    backgroundColor: colors.light,
  },
  timePickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  timePickerItemActive: {
    backgroundColor: colors.coralLight,
  },
  timePickerItemText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  timePickerItemTextActive: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.coral,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  timePickerCancel: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timePickerCancelText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  timePickerConfirm: {
    backgroundColor: colors.coral,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  timePickerConfirmText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  addCandidateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  addCandidateHighlighted: {
    borderColor: colors.coral,
    backgroundColor: '#FFF5F0',
  },
  addCandidateText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.coral,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  candidateRowActive: {
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  candidateBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateBadgeActive: {
    backgroundColor: colors.coral,
  },
  candidateBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  candidateBadgeTextActive: {
    color: colors.white,
  },
  candidateDate: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  candidateDateActive: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.coral,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  footerError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  footerErrorContent: {
    flex: 1,
  },
  footerErrorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  footerErrorIconText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
  footerErrorSummary: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.danger,
    marginBottom: 4,
  },
  footerErrorItem: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.danger,
    lineHeight: 16,
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
