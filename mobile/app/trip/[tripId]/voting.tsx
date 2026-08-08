import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Image,
  Linking,
} from 'react-native';
import { usePolls } from '@/features/voting/hooks/usePolls';
import { useCreatePoll } from '@/features/voting/hooks/useCreatePoll';
import { useUpdatePoll } from '@/features/voting/hooks/useUpdatePoll';
import { useVote } from '@/features/voting/hooks/useVote';
import { useLockPoll } from '@/features/voting/hooks/useLockPoll';
import { useDeletePoll } from '@/features/voting/hooks/useDeletePoll';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { useToast } from '@/components/Toast';
import { ConfirmModal } from '@/components/ConfirmModal';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { Calendar } from '@/components/icons/Calendar';
import { MapPin } from '@/components/icons/MapPin';
import { ListChecks } from '@/components/icons/ListChecks';
import { Plus } from '@/components/icons/Plus';
import { Trash2 } from '@/components/icons/Trash2';
import { ThumbsUp } from '@/components/icons/ThumbsUp';
import { Pencil } from '@/components/icons/Pencil';
import { CircleStop } from '@/components/icons/CircleStop';
import { ChevronDown } from '@/components/icons/ChevronDown';
import { X } from '@/components/icons/X';
import { Navigation } from '@/components/icons/Navigation';
import { Link2 } from '@/components/icons/Link2';
import { TimePicker } from '@/components/TimePicker';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import { bottomSheetFrame } from '@/theme/layout';
import type { TripPoll, PollOption, PollType, RefLink } from '@atur-perjalanan/shared-types';

const webOutlineNone = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {};

const WEEK_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function formatISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const POLL_TYPE_META: Record<
  PollType,
  { label: string; color: string; bg: string; icon: typeof Calendar }
> = {
  tanggal: { label: 'Tanggal', color: colors.coral, bg: colors.coralLight, icon: Calendar },
  aktivitas: { label: 'Aktivitas', color: colors.teal, bg: colors.tealLight, icon: MapPin },
  lainnya: { label: 'Lainnya', color: colors.muted, bg: colors.light, icon: ListChecks },
};

const POLL_TYPE_ORDER: PollType[] = ['tanggal', 'aktivitas', 'lainnya'];

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Aktif', color: colors.teal, bg: colors.tealLight },
  locked: { label: 'Selesai', color: colors.muted, bg: colors.light },
  expired: { label: 'Berakhir', color: colors.muted, bg: colors.light },
};

const MONTH_NAMES_FULL = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

function formatDateRangeShort(start: string, end: string) {
  const s = start.split('-').map(Number);
  const e = end.split('-').map(Number);
  const sm = s[1] - 1;
  const em = e[1] - 1;
  if (sm === em && s[0] === e[0]) return `${s[2]} – ${e[2]} ${MONTH_NAMES_FULL[em]} ${e[0]}`;
  return `${s[2]} ${MONTH_NAMES_FULL[sm]} – ${e[2]} ${MONTH_NAMES_FULL[em]} ${e[0]}`;
}

function formatDeadline(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTH_NAMES_FULL[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

function parseISO(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    hh: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
  };
}

function buildDeadlineISO(dateIso: string, timeStr: string) {
  const [hh, mm] = timeStr.split(':').map(Number);
  const [yyyy, mm2, dd] = dateIso.split('-').map(Number);
  return new Date(yyyy, mm2 - 1, dd, hh, mm).toISOString();
}

/**
 * Tenggat field — konsisten dengan form buat perjalanan: kalender bulanan +
 * TimePicker jam, bukan input teks bebas.
 */
function DeadlineField({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const parsed = parseISO(value);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(parsed?.year ?? new Date().getFullYear());
  const [month, setMonth] = useState(parsed?.month ?? new Date().getMonth());
  const [time, setTime] = useState(parsed ? `${parsed.hh}:${parsed.mm}` : '20:00');
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(
    parsed ? formatISO(parsed.year, parsed.month, parsed.day) : null,
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const p = parseISO(value);
    if (p) {
      setYear(p.year);
      setMonth(p.month);
      setTime(`${p.hh}:${p.mm}`);
      setSelectedDateIso(formatISO(p.year, p.month, p.day));
    } else if (!value) {
      setSelectedDateIso(null);
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectDate = (dateIso: string) => {
    setSelectedDateIso(dateIso);
    onChange(buildDeadlineISO(dateIso, time));
  };

  const selectTime = (timeStr: string) => {
    setTime(timeStr);
    if (selectedDateIso) {
      onChange(buildDeadlineISO(selectedDateIso, timeStr));
    }
  };

  return (
    <View>
      <Text style={styles.sheetLabel}>Tenggat (opsional)</Text>
      <TouchableOpacity
        style={[styles.deadlineBox, open && styles.deadlineBoxOpen]}
        onPress={() => {
          setOpen(!open);
          setShowTimePicker(false);
        }}
        activeOpacity={0.7}
      >
        <Calendar size={16} color={value ? colors.coral : colors.muted} />
        <Text style={[styles.deadlineText, !value && styles.deadlinePlaceholder]}>
          {value ? formatDeadline(value) : 'Pilih tanggal & waktu...'}
        </Text>
        {value ? (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={14} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {open && (
        <View style={styles.deadlinePicker}>
          <View style={styles.dpHeader}>
            <TouchableOpacity
              style={styles.dpNav}
              onPress={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear(year - 1);
                } else setMonth(month - 1);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 16, color: colors.charcoal }}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.dpMonth}>
              {MONTH_NAMES_FULL[month]} {year}
            </Text>
            <TouchableOpacity
              style={styles.dpNav}
              onPress={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear(year + 1);
                } else setMonth(month + 1);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 16, color: colors.charcoal }}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dpWeekRow}>
            {WEEK_DAYS.map((d) => (
              <Text key={d} style={styles.dpWeekDay}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.dpGrid}>
            {cells.map((day, i) => {
              if (day === null) return <View key={`e-${i}`} style={styles.dpCell} />;
              const iso = formatISO(year, month, day);
              const selected = selectedDateIso === iso;
              return (
                <TouchableOpacity
                  key={day}
                  style={styles.dpCell}
                  onPress={() => selectDate(iso)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.dpDay, selected && styles.dpDaySelected]}>
                    <Text style={[styles.dpDayText, selected && styles.dpDayTextSelected]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.deadlineTimeRow}>
            <Text style={styles.deadlineTimeLabel}>Jam</Text>
            <TouchableOpacity
              style={[styles.deadlineTimeBox, showTimePicker && styles.timeInputBoxFocused]}
              onPress={() => setShowTimePicker(!showTimePicker)}
              activeOpacity={0.7}
            >
              <Text style={styles.deadlineTimeValue}>{time}</Text>
            </TouchableOpacity>
            <Text style={styles.deadlineTimeHint}>Pilih tanggal lalu atur jam.</Text>
          </View>
          <TimePicker
            visible={showTimePicker}
            value={time}
            onChange={selectTime}
            onClose={() => setShowTimePicker(false)}
            startLabel="Jam"
          />
        </View>
      )}
    </View>
  );
}

/**
 * Input untuk maps_link + ref_links sebuah kandidat voting — mengikuti pola
 * form aktivitas (maps link + link referensi dengan judul opsional).
 */
function OptionLinkFields({
  mapsLink,
  refLinks,
  onChangeMapsLink,
  onChangeRefLinks,
}: {
  mapsLink: string;
  refLinks: RefLink[];
  onChangeMapsLink: (url: string) => void;
  onChangeRefLinks: (links: RefLink[]) => void;
}) {
  const updateRef = useCallback(
    (index: number, patch: Partial<RefLink>) => {
      onChangeRefLinks(refLinks.map((r, i) => (i === index ? { ...r, ...patch } : r)));
    },
    [refLinks, onChangeRefLinks],
  );

  const addRef = useCallback(() => {
    onChangeRefLinks([...refLinks, { url: '', label: '' }]);
  }, [refLinks, onChangeRefLinks]);

  const removeRef = useCallback(
    (index: number) => {
      if (refLinks.length === 1) return;
      onChangeRefLinks(refLinks.filter((_, i) => i !== index));
    },
    [refLinks, onChangeRefLinks],
  );

  return (
    <>
      {/* Google Maps */}
      <View style={styles.optionLinkField}>
        <Text style={styles.optionLinkLabel}>Google Maps</Text>
        <View style={styles.optionLinkInputRow}>
          <Navigation size={14} color={mapsLink ? colors.teal : colors.mutedLight} />
          <FocusedTextInput
            style={styles.optionLinkInput}
            placeholder="Tempel link Google Maps (opsional)"
            placeholderTextColor={colors.mutedLight}
            value={mapsLink}
            onChangeText={onChangeMapsLink}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>
      </View>

      {/* Link lainnya */}
      <View style={styles.optionLinkField}>
        <Text style={styles.optionLinkLabel}>Link Referensi</Text>
        {refLinks.map((ref, index) => (
          <View key={index} style={styles.optionRefGroup}>
            {refLinks.length > 1 && (
              <Text style={styles.optionRefIndex}>Link {index + 1}</Text>
            )}
            <Text style={styles.optionRefSubLabel}>URL</Text>
            <View style={styles.optionLinkInputRow}>
              <Link2 size={14} color={colors.mutedLight} />
              <FocusedTextInput
                style={styles.optionLinkInput}
                placeholder="Tempel link referensi..."
                placeholderTextColor={colors.mutedLight}
                value={ref.url}
                onChangeText={(t) => updateRef(index, { url: t })}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              {refLinks.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeRef(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>
            {ref.url.trim().length > 0 && (
              <>
                <Text style={styles.optionRefSubLabel}>Judul tampilan</Text>
                <FocusedTextInput
                  style={styles.optionLinkInput}
                  placeholder="Kosongkan untuk tampilkan URL"
                  placeholderTextColor={colors.mutedLight}
                  value={ref.label}
                  onChangeText={(t) => updateRef(index, { label: t })}
                />
              </>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.optionAddLinkBtn} onPress={addRef} activeOpacity={0.7}>
          <Text style={styles.optionAddLinkBtnText}>+ Tambah link</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function VoterAvatars({ voters, max = 4 }: { voters: PollOption['voters']; max?: number }) {
  const shown = voters.slice(0, max);
  return (
    <View style={styles.avatarStack}>
      {shown.map((v, i) => (
        <View
          key={v.id}
          style={[
            styles.voterAvatar,
            {
              backgroundColor: avatarColorFor(v.username),
              marginLeft: i > 0 ? -8 : 0,
              zIndex: shown.length - i,
              overflow: 'hidden',
            },
          ]}
        >
          {v.avatar_url ? (
            <Image source={{ uri: v.avatar_url }} style={styles.voterAvatarImage} />
          ) : (
            <Text style={styles.voterAvatarLetter}>{v.name.charAt(0).toUpperCase()}</Text>
          )}
        </View>
      ))}
      {voters.length > max && (
        <View
          style={[styles.voterAvatar, { backgroundColor: colors.muted, marginLeft: -8, zIndex: 0 }]}
        >
          <Text style={styles.voterAvatarLetter}>+{voters.length - max}</Text>
        </View>
      )}
    </View>
  );
}

function VotingCandidateRow({
  option,
  poll,
  onVote,
  onRetract,
  voting,
}: {
  option: PollOption;
  poll: TripPoll;
  onVote: () => void;
  onRetract: () => void;
  voting?: boolean;
}) {
  const winnerOption = poll.options.reduce(
    (a, b) => (b.vote_count > a.vote_count ? b : a),
    poll.options[0],
  );
  const isWinner =
    (poll.status === 'locked' || poll.status === 'expired') && winnerOption?.id === option.id;
  const isReadOnly = poll.status === 'locked' || poll.status === 'expired';
  const isVoted = option.has_voted;

  return (
    <View
      style={[
        styles.candidateCard,
        isVoted && styles.candidateCardVoted,
        isWinner && styles.candidateCardWinner,
        isReadOnly && !isWinner && styles.candidateCardReadOnly,
      ]}
    >
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateLabel}>{option.label}</Text>
        <View style={styles.candidateMeta}>
          <View style={styles.votePill}>
            <ThumbsUp size={10} color={isVoted || isWinner ? colors.coral : colors.muted} />
            <Text style={[styles.voteCount, (isVoted || isWinner) && styles.voteCountActive]}>
              {option.vote_count}
            </Text>
          </View>
          {option.voters.length > 0 && <VoterAvatars voters={option.voters} />}
          {isWinner && <Text style={styles.winnerText}>Pemenang</Text>}
          {isVoted && !isWinner && <Text style={styles.votedText}>✓ Voted</Text>}
        </View>
        {(option.maps_link || option.ref_links.length > 0) && (
          <View style={styles.candidateLinks}>
            {option.maps_link && (
              <TouchableOpacity
                style={styles.candidateLinkPill}
                onPress={() => Linking.openURL(option.maps_link!).catch(() => {})}
                activeOpacity={0.7}
              >
                <Navigation size={11} color={colors.teal} />
                <Text style={styles.candidateLinkText} numberOfLines={1}>
                  Google Maps
                </Text>
              </TouchableOpacity>
            )}
            {option.ref_links.map((ref, i) => (
              <TouchableOpacity
                key={`${ref.url}-${i}`}
                style={styles.candidateLinkPill}
                onPress={() => Linking.openURL(ref.url).catch(() => {})}
                activeOpacity={0.7}
              >
                <Link2 size={11} color={colors.muted} />
                <Text style={styles.candidateLinkText} numberOfLines={1}>
                  {ref.label || ref.url}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {!isReadOnly &&
        (isVoted ? (
          <TouchableOpacity
            style={[styles.voteBtn, voting && styles.voteBtnDisabled]}
            onPress={onRetract}
            disabled={voting}
          >
            {voting ? (
              <ActivityIndicator size="small" color={colors.charcoal} />
            ) : (
              <Text style={styles.voteBtnText}>Batal</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.voteBtn, voting && styles.voteBtnDisabled]}
            onPress={onVote}
            disabled={voting}
          >
            {voting ? (
              <ActivityIndicator size="small" color={colors.charcoal} />
            ) : (
              <Text style={styles.voteBtnText}>Vote</Text>
            )}
          </TouchableOpacity>
        ))}
    </View>
  );
}

function VotingCollapseSection({
  poll,
  tripId,
  isCreator,
  onEdit,
  onLocked,
}: {
  poll: TripPoll;
  tripId: string;
  isCreator: boolean;
  onEdit: (poll: TripPoll) => void;
  onLocked: (poll: TripPoll, result: string) => void;
}) {
  const [expanded, setExpanded] = useState(poll.status === 'active');
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'lock' | 'delete' | null>(null);
  const { vote, retractVote } = useVote(tripId);
  const lockPoll = useLockPoll(tripId);
  const deletePoll = useDeletePoll(tripId);
  const { showToast } = useToast();

  const meta = POLL_TYPE_META[poll.poll_type];
  const IconComponent = meta.icon;
  const totalVotes = poll.options.reduce((sum, o) => sum + o.vote_count, 0);
  const isEnded = poll.status === 'locked' || poll.status === 'expired';
  const statusMeta = STATUS_META[poll.status] ?? STATUS_META.active;

  const subtitle = useMemo(() => {
    const parts: string[] = [];
    if (poll.status === 'active') parts.push(`${totalVotes} vote`);
    else if (poll.status === 'locked') parts.push('Selesai');
    else if (poll.status === 'expired') parts.push('Berakhir');
    if (poll.status === 'active' && poll.deadline) parts.push(`tenggat ${formatDeadline(poll.deadline)}`);
    return parts.join(' · ');
  }, [poll, totalVotes]);

  const handleLock = useCallback(() => {
    setShowMenu(false);
    setConfirmAction('lock');
  }, []);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    setConfirmAction('delete');
  }, []);

  const handleConfirmLock = useCallback(() => {
    setShowMenu(false);
    setConfirmAction(null);
    lockPoll.mutate(poll.id, {
      onSuccess: () => {
        const winner = poll.options.reduce(
          (a, b) => (b.vote_count > a.vote_count ? b : a),
          poll.options[0],
        );
        onLocked(poll, winner?.label ?? '');
      },
      onError: () => showToast('Tidak dapat mengakhiri voting'),
    });
  }, [lockPoll, poll, onLocked, showToast]);

  const handleConfirmDelete = useCallback(() => {
    setShowMenu(false);
    setConfirmAction(null);
    deletePoll.mutate(poll.id, {
      onError: () => showToast('Tidak dapat menghapus voting'),
    });
  }, [deletePoll, poll.id, showToast]);

  return (
    <View
      style={[
        styles.collapseCard,
        isEnded && styles.collapseCardEnded,
        showMenu && styles.collapseCardMenuOpen,
      ]}
    >
      <View style={styles.collapseHeader}>
        <TouchableOpacity
          style={styles.collapseHeaderMain}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <View style={[styles.collapseIconBox, { backgroundColor: meta.bg }]}>
            <IconComponent size={17} color={meta.color} />
          </View>
          <View style={styles.collapseInfo}>
            <View style={styles.collapseTitleRow}>
              <Text style={styles.collapseTitle} numberOfLines={1}>
                {poll.title}
              </Text>
              {isEnded && (
                <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusMeta.color }]}>
                    {statusMeta.label}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.collapseSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </TouchableOpacity>

        {isCreator && (
          <TouchableOpacity
            style={[styles.menuBtn, showMenu && styles.menuBtnOpen]}
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 15,
                color: showMenu ? colors.coral : colors.muted,
                fontWeight: 800,
              }}
            >
              ⋯
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <ChevronDown
            size={18}
            color={colors.muted}
            style={expanded ? { transform: [{ rotate: '180deg' }] } : undefined}
          />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuDropdown}>
            {!isEnded && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    onEdit(poll);
                  }}
                >
                  <Pencil size={15} color={colors.charcoal} />
                  <Text style={styles.menuItemText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLock}>
                  <CircleStop size={15} color={colors.coral} />
                  <Text style={[styles.menuItemText, { color: colors.coral }]}>Akhiri Voting</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
              </>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Trash2 size={15} color={colors.danger} />
              <Text style={[styles.menuItemText, { color: colors.danger }]}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {expanded && (
        <View style={styles.collapseBody}>
          {poll.options
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((option) => (
              <VotingCandidateRow
                key={option.id}
                option={option}
                poll={poll}
                voting={
                  (vote.isPending && vote.variables?.optionId === option.id) ||
                  (retractVote.isPending && (poll as any).voted_option_id === option.id)
                }
                onVote={() => vote.mutate({ pollId: poll.id, optionId: option.id })}
                onRetract={() => retractVote.mutate(poll.id)}
              />
            ))}
        </View>
      )}

      <ConfirmModal
        visible={confirmAction !== null}
        title={confirmAction === 'lock' ? 'Akhiri Voting?' : 'Hapus voting?'}
        description={
          confirmAction === 'lock'
            ? `Voting "${poll.title}" akan dikunci.`
            : `Voting "${poll.title}" akan dihapus.`
        }
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel={confirmAction === 'lock' ? 'Akhiri' : 'Hapus'}
        destructive
        loading={lockPoll.isPending || deletePoll.isPending}
        onConfirm={confirmAction === 'lock' ? handleConfirmLock : handleConfirmDelete}
        onCancel={() => setConfirmAction(null)}
      />
    </View>
  );
}

// ─── Voting result (lock) modal ──────────────────────────────────────────────

function VotingLockedModal({
  visible,
  type,
  title,
  resultValue,
  hint,
  onClose,
}: {
  visible: boolean;
  type: PollType;
  title: string;
  resultValue: string;
  hint: string;
  onClose: () => void;
}) {
  const meta = POLL_TYPE_META[type];
  const Icon = meta.icon;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.lockedBackdrop}>
        <View style={styles.lockedCard}>
          <TouchableOpacity
            style={styles.lockedClose}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={13} color={colors.muted} />
          </TouchableOpacity>
          <View style={[styles.lockedTypeBadge, { backgroundColor: meta.bg }]}>
            <Icon size={10} color={meta.color} />
            <Text style={[styles.lockedTypeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={styles.lockedTitle}>Voting {title} Selesai</Text>
          <View style={styles.lockedResultBox}>
            <Text style={styles.lockedResultLabel}>Hasil dipilih</Text>
            <Text style={styles.lockedResultValue}>{resultValue}</Text>
          </View>
          {hint ? <Text style={styles.lockedHint}>{hint}</Text> : null}
          <TouchableOpacity style={styles.lockedOk} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.lockedOkText}>Oke</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Date picker calendar (add tanggal candidate) ───────────────────────────

function DatePickerCalendar({
  year,
  month,
  range,
  selectingEnd,
  onPrev,
  onNext,
  onSelect,
}: {
  year: number;
  month: number;
  range: { start: string; end: string } | null;
  selectingEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (iso: string) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={styles.dpCard}>
      <View style={styles.dpHeader}>
        <TouchableOpacity
          style={styles.dpNav}
          onPress={onPrev}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 16, color: colors.charcoal }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.dpMonth}>
          {MONTH_NAMES_FULL[month]} {year}
        </Text>
        <TouchableOpacity
          style={styles.dpNav}
          onPress={onNext}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 16, color: colors.charcoal }}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dpWeekRow}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} style={styles.dpWeekDay}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.dpGrid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={`e-${i}`} style={styles.dpCell} />;
          const iso = formatISO(year, month, day);
          const isStart = range?.start === iso;
          const isEnd = range?.end === iso;
          const isInRange = range ? iso > range.start && iso < range.end : false;
          const selected = isStart || isEnd;
          return (
            <TouchableOpacity
              key={day}
              style={styles.dpCell}
              onPress={() => onSelect(iso)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dpDay,
                  selected && styles.dpDaySelected,
                  isInRange && styles.dpDayInRange,
                ]}
              >
                <Text
                  style={[
                    styles.dpDayText,
                    selected && styles.dpDayTextSelected,
                    isInRange && styles.dpDayTextInRange,
                  ]}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {range && !selectingEnd && (
        <Text style={styles.dpHint}>
          Rentang {formatDateRangeShort(range.start, range.end)} — tap tanggal lain untuk ganti.
        </Text>
      )}
      {selectingEnd && <Text style={styles.dpHint}>Pilih tanggal akhir.</Text>}
    </View>
  );
}

// ─── Create / Edit voting sheet ─────────────────────────────────────────────

type SheetMode = 'type' | 'detail';

interface DateCandidateOption {
  id: string;
  start_date: string;
  end_date: string;
}

interface PollOptionDraft {
  label: string;
  maps_link: string;
  ref_links: RefLink[];
}

function CreateVotingSheet({
  visible,
  tripId,
  ongoingTypes,
  onClose,
}: {
  visible: boolean;
  tripId: string;
  /** Jenis yang sudah punya poll aktif — tidak bisa dibuat lagi (badge "Sedang berlangsung"). */
  ongoingTypes: PollType[];
  onClose: () => void;
}) {
  const createPoll = useCreatePoll(tripId);
  const { data: trip } = useTripDetail(tripId);
  const { showToast } = useToast();
  const [mode, setMode] = useState<SheetMode>('type');
  const [pollType, setPollType] = useState<PollType>('aktivitas');
  const [title, setTitle] = useState('');
  const [optionText, setOptionText] = useState('');
  const [options, setOptions] = useState<PollOptionDraft[]>([]);
  const [deadline, setDeadline] = useState('');

  // Tanggal poll candidates
  const tripCandidates: DateCandidateOption[] = useMemo(
    () => (trip?.date_candidates ?? []) as DateCandidateOption[],
    [trip],
  );
  const [dateCandidates, setDateCandidates] = useState<DateCandidateOption[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dpYear, setDpYear] = useState(new Date().getFullYear());
  const [dpMonth, setDpMonth] = useState(new Date().getMonth());
  const [dpRange, setDpRange] = useState<{ start: string; end: string } | null>(null);
  const [dpSelectingEnd, setDpSelectingEnd] = useState(false);

  const activeType = pollType;

  const reset = useCallback(() => {
    setMode('type');
    setPollType('aktivitas');
    setTitle('');
    setOptionText('');
    setOptions([]);
    setDeadline('');
    setDateCandidates([]);
    setShowDatePicker(false);
  }, []);

  // Seed date candidates from the trip once the sheet opens AND trip data is
  // available (trip may load after the modal mounts — otherwise tanggal voting
  // would always show "Minimal 1 kandidat").
  const [hydrated, setHydrated] = useState(false);
  if (visible && !hydrated) {
    if (tripCandidates.length > 0) {
      setDateCandidates(tripCandidates);
      setHydrated(true);
    }
  }
  if (!visible && hydrated) {
    setHydrated(false);
    reset();
  }

  const addOption = useCallback(() => {
    const trimmed = optionText.trim();
    if (trimmed && !options.some((o) => o.label === trimmed)) {
      setOptions((prev) => [...prev, { label: trimmed, maps_link: '', ref_links: [{ url: '', label: '' }] }]);
      setOptionText('');
    }
  }, [optionText, options]);

  const removeOption = useCallback((label: string) => {
    setOptions((prev) => prev.filter((o) => o.label !== label));
  }, []);

  const patchOption = useCallback((label: string, patch: Partial<PollOptionDraft>) => {
    setOptions((prev) => prev.map((o) => (o.label === label ? { ...o, ...patch } : o)));
  }, []);

  const handleNext = useCallback(() => {
    setMode('detail');
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      console.log('SUBMIT', activeType);
      if (activeType === 'tanggal') {
        if (dateCandidates.length === 0) {
          showToast('Minimal 1 kandidat tanggal wajib diisi');
          return;
        }
        await createPoll.mutateAsync({
          title: 'Tanggal Perjalanan',
          poll_type: 'tanggal',
          options: dateCandidates.map((c) => ({
            label: formatDateRangeShort(c.start_date, c.end_date),
            candidate_id: c.id,
            start_date: c.start_date,
            end_date: c.end_date,
          })),
          deadline: deadline || undefined,
        });
      } else {
        if (!title.trim() || options.length < 2) {
          showToast('Judul dan minimal 2 kandidat wajib diisi');
          return;
        }
        await createPoll.mutateAsync({
          title: title.trim(),
          poll_type: activeType,
          options: options.map((o) => ({
            label: o.label,
            maps_link: o.maps_link.trim() || undefined,
            ref_links: o.ref_links
              .map((r) => {
                const url = r.url.trim();
                const label = r.label.trim();
                return label ? { url, label } : { url };
              })
              .filter((r) => r.url.length > 0),
          })),
          deadline: deadline || undefined,
        });
      }
      reset();
      onClose();
    } catch (err: any) {
      const msg = err?.message ?? 'Terjadi kesalahan saat membuat voting';
      showToast(msg);
    }
  }, [activeType, dateCandidates, title, options, deadline, createPoll, reset, onClose, showToast]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.sheetBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            {mode === 'detail' ? (
              <TouchableOpacity
                style={styles.sheetBackBtn}
                onPress={() => setMode('type')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 18, color: colors.charcoal }}>‹</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.sheetBackBtn} />
            )}
            <Text style={styles.sheetTitle}>
              {mode === 'type' ? 'Buat Voting' : 'Detail Voting'}
            </Text>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={onClose}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetBody}
            contentContainerStyle={styles.sheetBodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {mode === 'type' ? (
              <>
                <Text style={styles.sheetSubtitle}>
                  Pilih jenis voting yang akan diputuskan bersama anggota.
                </Text>
                {(['tanggal', 'aktivitas', 'lainnya'] as PollType[]).map((t) => {
                  const m = POLL_TYPE_META[t];
                  const Icon = m.icon;
                  const ongoing = ongoingTypes.includes(t);
                  const selected = activeType === t && !ongoing;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typeOption,
                        selected && { backgroundColor: m.bg, borderColor: m.color },
                        ongoing && styles.typeOptionDisabled,
                      ]}
                      onPress={() => {
                        if (!ongoing) setPollType(t);
                      }}
                      activeOpacity={0.7}
                      disabled={ongoing}
                    >
                      <View style={[styles.typeOptionIcon, { backgroundColor: m.bg }]}>
                        <Icon size={19} color={m.color} />
                      </View>
                      <View style={styles.typeOptionInfo}>
                        <View style={styles.typeOptionLabelRow}>
                          <Text style={styles.typeOptionLabel}>{m.label}</Text>
                          {ongoing && (
                            <View style={styles.ongoingBadge}>
                              <Text style={styles.ongoingBadgeText}>Sedang berlangsung</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.typeOptionDesc}>
                          {t === 'tanggal'
                            ? 'Untuk menentukan tanggal perjalanan jika ada konflik ketersediaan tanggal anggota.'
                            : t === 'aktivitas'
                              ? 'Untuk memilih aktivitas atau destinasi di slot itinerary.'
                              : 'Keputusan custom — transportasi, akomodasi, dll.'}
                        </Text>
                      </View>
                      <View style={[styles.radioOuter, selected && { borderColor: m.color }]}>
                        {selected && (
                          <View style={[styles.radioInner, { backgroundColor: m.color }]} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : activeType === 'tanggal' ? (
              <>
                <View
                  style={[styles.typeBadgeInline, { backgroundColor: POLL_TYPE_META.tanggal.bg }]}
                >
                  <Calendar size={11} color={POLL_TYPE_META.tanggal.color} />
                  <Text
                    style={[styles.typeBadgeInlineText, { color: POLL_TYPE_META.tanggal.color }]}
                  >
                    Tanggal
                  </Text>
                </View>
                <Text style={styles.sheetLabel}>
                  Kandidat Tanggal <Text style={{ color: colors.coral }}>*</Text>
                </Text>
                {dateCandidates.map((c) => (
                  <View key={c.id} style={styles.optionRow}>
                    <Text style={styles.optionText}>
                      {formatDateRangeShort(c.start_date, c.end_date)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setDateCandidates((prev) => prev.filter((x) => x.id !== c.id))}
                    >
                      <X size={14} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                ))}
                {dateCandidates.length < 3 && (
                  <TouchableOpacity
                    style={styles.addCandidateBtn}
                    onPress={() => {
                      setShowDatePicker(true);
                      setDpRange(null);
                      setDpSelectingEnd(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={colors.coral} />
                    <Text style={styles.addCandidateBtnText}>Tambah Kandidat Tanggal</Text>
                  </TouchableOpacity>
                )}
                {showDatePicker && (
                  <DatePickerCalendar
                    year={dpYear}
                    month={dpMonth}
                    range={dpRange}
                    selectingEnd={dpSelectingEnd}
                    onPrev={() => {
                      if (dpMonth === 0) {
                        setDpMonth(11);
                        setDpYear(dpYear - 1);
                      } else setDpMonth(dpMonth - 1);
                    }}
                    onNext={() => {
                      if (dpMonth === 11) {
                        setDpMonth(0);
                        setDpYear(dpYear + 1);
                      } else setDpMonth(dpMonth + 1);
                    }}
                    onSelect={(iso) => {
                      if (!dpRange) {
                        setDpRange({ start: iso, end: iso });
                        setDpSelectingEnd(true);
                      } else if (dpSelectingEnd) {
                        const start = dpRange.start;
                        const range = { start, end: iso >= start ? iso : start };
                        setDpRange(range);
                        setDpSelectingEnd(false);
                        const cid = `dp-${Date.now()}`;
                        setDateCandidates((prev) => [
                          ...prev,
                          { id: cid, start_date: range.start, end_date: range.end },
                        ]);
                        setShowDatePicker(false);
                      } else {
                        setDpRange({ start: iso, end: iso });
                        setDpSelectingEnd(true);
                      }
                    }}
                  />
                )}
                <DeadlineField value={deadline} onChange={setDeadline} />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.typeBadgeInline,
                    { backgroundColor: POLL_TYPE_META[activeType].bg },
                  ]}
                >
                  {(() => {
                    const Icon = POLL_TYPE_META[activeType].icon;
                    return <Icon size={11} color={POLL_TYPE_META[activeType].color} />;
                  })()}
                  <Text
                    style={[
                      styles.typeBadgeInlineText,
                      { color: POLL_TYPE_META[activeType].color },
                    ]}
                  >
                    {POLL_TYPE_META[activeType].label}
                  </Text>
                </View>
                <Text style={styles.sheetLabel}>
                  Judul Voting <Text style={{ color: colors.coral }}>*</Text>
                </Text>
                <FocusedTextInput
                  style={styles.sheetInput}
                  placeholder="Contoh: Destinasi Hari ke-2"
                  placeholderTextColor={colors.mutedLight}
                  value={title}
                  onChangeText={setTitle}
                />
                <Text style={styles.sheetLabel}>
                  Kandidat <Text style={{ color: colors.coral }}>*</Text>
                </Text>
                {options.map((opt) => (
                  <View key={opt.label} style={styles.optionCard}>
                    <View style={styles.optionCardHeader}>
                      <View style={styles.optionCheck} />
                      <Text style={styles.optionText}>{opt.label}</Text>
                      <TouchableOpacity onPress={() => removeOption(opt.label)}>
                        <X size={14} color={colors.muted} />
                      </TouchableOpacity>
                    </View>
                    <OptionLinkFields
                      mapsLink={opt.maps_link}
                      refLinks={opt.ref_links}
                      onChangeMapsLink={(url) => patchOption(opt.label, { maps_link: url })}
                      onChangeRefLinks={(links) => patchOption(opt.label, { ref_links: links })}
                    />
                  </View>
                ))}
                <View style={styles.optionInputRow}>
                  <FocusedTextInput
                    style={[styles.sheetInput, { flex: 1 }]}
                    placeholder="Tambah kandidat..."
                    placeholderTextColor={colors.mutedLight}
                    value={optionText}
                    onChangeText={setOptionText}
                    onSubmitEditing={addOption}
                  />
                  <TouchableOpacity style={styles.addOptionBtn} onPress={addOption}>
                    <Plus size={16} color={colors.coral} />
                  </TouchableOpacity>
                </View>
                <DeadlineField value={deadline} onChange={setDeadline} />
              </>
            )}
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[
                styles.sheetSubmitBtn,
                createPoll.isPending && { backgroundColor: colors.disabled },
              ]}
              onPress={mode === 'type' ? handleNext : handleSubmit}
              disabled={createPoll.isPending}
              activeOpacity={0.8}
            >
              {createPoll.isPending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.sheetSubmitText}>
                  {mode === 'type' ? 'Lanjutkan' : 'Buat Voting'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Edit voting sheet ──────────────────────────────────────────────────────

function EditVotingSheet({
  visible,
  tripId,
  poll,
  onClose,
}: {
  visible: boolean;
  tripId: string;
  poll: TripPoll | null;
  onClose: () => void;
}) {
  const updatePoll = useUpdatePoll(tripId);
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [optionText, setOptionText] = useState('');
  const [options, setOptions] = useState<PollOptionDraft[]>([]);
  const [deadline, setDeadline] = useState('');
  const [editShowDatePicker, setEditShowDatePicker] = useState(false);
  const [editDpYear, setEditDpYear] = useState(new Date().getFullYear());
  const [editDpMonth, setEditDpMonth] = useState(new Date().getMonth());
  const [editDpRange, setEditDpRange] = useState<{ start: string; end: string } | null>(null);
  const [editDpSelectingEnd, setEditDpSelectingEnd] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  if (visible && poll && !hydrated) {
    setTitle(poll.title);
    setOptions(
      poll.options.map((o) => ({
        label: o.label,
        maps_link: o.maps_link ?? '',
        ref_links:
          o.ref_links.length > 0
            ? o.ref_links.map((r) => ({ url: r.url, label: r.label ?? '' }))
            : [{ url: '', label: '' }],
      })),
    );
    setDeadline(poll.deadline ?? '');
    setHydrated(true);
  }
  if (!visible && hydrated) setHydrated(false);

  const addOption = useCallback(() => {
    const trimmed = optionText.trim();
    if (trimmed && !options.some((o) => o.label === trimmed)) {
      setOptions((prev) => [...prev, { label: trimmed, maps_link: '', ref_links: [{ url: '', label: '' }] }]);
      setOptionText('');
    }
  }, [optionText, options]);

  const removeOption = useCallback((label: string) => {
    setOptions((prev) => prev.filter((o) => o.label !== label));
  }, []);

  const patchOption = useCallback((label: string, patch: Partial<PollOptionDraft>) => {
    setOptions((prev) => prev.map((o) => (o.label === label ? { ...o, ...patch } : o)));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!poll) return;
    try {
      await updatePoll.mutateAsync({
        pollId: poll.id,
        payload: {
          title: poll.poll_type === 'tanggal' ? undefined : title.trim(),
          options: options.map((o) => ({
            label: o.label,
            maps_link: o.maps_link.trim() || undefined,
            ref_links: o.ref_links
              .map((r) => {
                const url = r.url.trim();
                const label = r.label.trim();
                return label ? { url, label } : { url };
              })
              .filter((r) => r.url.length > 0),
          })),
          deadline: deadline || null,
        },
      });
      onClose();
    } catch {
      showToast('Tidak dapat menyimpan perubahan');
    }
  }, [poll, title, options, deadline, updatePoll, onClose, showToast]);

  const meta = poll ? POLL_TYPE_META[poll.poll_type] : null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.sheetBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetBackBtn} />
            <Text style={styles.sheetTitle}>Edit Voting</Text>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={onClose}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetBody}
            contentContainerStyle={styles.sheetBodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {meta && (
              <View style={[styles.typeBadgeInline, { backgroundColor: meta.bg }]}>
                {(() => {
                  const Icon = meta.icon;
                  return <Icon size={11} color={meta.color} />;
                })()}
                <Text style={[styles.typeBadgeInlineText, { color: meta.color }]}>
                  {meta.label}
                </Text>
              </View>
            )}
            {poll?.poll_type !== 'tanggal' && (
              <>
                <Text style={styles.sheetLabel}>
                  Judul Voting <Text style={{ color: colors.coral }}>*</Text>
                </Text>
                <FocusedTextInput
                  style={styles.sheetInput}
                  placeholder="Judul voting"
                  placeholderTextColor={colors.mutedLight}
                  value={title}
                  onChangeText={setTitle}
                />
              </>
            )}
            <Text style={styles.sheetLabel}>
              Kandidat <Text style={{ color: colors.coral }}>*</Text>
            </Text>
            {options.map((opt) => (
              <View key={opt.label} style={styles.optionCard}>
                <View style={styles.optionCardHeader}>
                  <Text style={styles.optionText}>{opt.label}</Text>
                  <TouchableOpacity onPress={() => removeOption(opt.label)}>
                    <X size={14} color={colors.muted} />
                  </TouchableOpacity>
                </View>
                {poll?.poll_type !== 'tanggal' && (
                  <OptionLinkFields
                    mapsLink={opt.maps_link}
                    refLinks={opt.ref_links}
                    onChangeMapsLink={(url) => patchOption(opt.label, { maps_link: url })}
                    onChangeRefLinks={(links) => patchOption(opt.label, { ref_links: links })}
                  />
                )}
              </View>
            ))}
            {poll?.poll_type === 'tanggal' ? (
              <>
                {options.length < 3 && (
                  <TouchableOpacity
                    style={styles.addCandidateBtn}
                    onPress={() => {
                      setEditShowDatePicker(true);
                      setEditDpRange(null);
                      setEditDpSelectingEnd(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={colors.coral} />
                    <Text style={styles.addCandidateBtnText}>Tambah Kandidat Tanggal</Text>
                  </TouchableOpacity>
                )}
                {editShowDatePicker && (
                  <DatePickerCalendar
                    year={editDpYear}
                    month={editDpMonth}
                    range={editDpRange}
                    selectingEnd={editDpSelectingEnd}
                    onPrev={() => {
                      if (editDpMonth === 0) {
                        setEditDpMonth(11);
                        setEditDpYear(editDpYear - 1);
                      } else setEditDpMonth(editDpMonth - 1);
                    }}
                    onNext={() => {
                      if (editDpMonth === 11) {
                        setEditDpMonth(0);
                        setEditDpYear(editDpYear + 1);
                      } else setEditDpMonth(editDpMonth + 1);
                    }}
                    onSelect={(iso) => {
                      if (!editDpRange) {
                        setEditDpRange({ start: iso, end: iso });
                        setEditDpSelectingEnd(true);
                      } else if (editDpSelectingEnd) {
                        const start = editDpRange.start;
                        const range = { start, end: iso >= start ? iso : start };
                        setEditDpRange(range);
                        setEditDpSelectingEnd(false);
                        setOptions((prev) => [
                          ...prev,
                          {
                            label: formatDateRangeShort(range.start, range.end),
                            maps_link: '',
                            ref_links: [{ url: '', label: '' }],
                          },
                        ]);
                        setEditShowDatePicker(false);
                      } else {
                        setEditDpRange({ start: iso, end: iso });
                        setEditDpSelectingEnd(true);
                      }
                    }}
                  />
                )}
              </>
            ) : (
              <View style={styles.optionInputRow}>
                <FocusedTextInput
                  style={[styles.sheetInput, { flex: 1 }]}
                  placeholder="Tambah kandidat..."
                  placeholderTextColor={colors.mutedLight}
                  value={optionText}
                  onChangeText={setOptionText}
                  onSubmitEditing={addOption}
                />
                <TouchableOpacity style={styles.addOptionBtn} onPress={addOption}>
                  <Plus size={16} color={colors.coral} />
                </TouchableOpacity>
              </View>
            )}
            <DeadlineField value={deadline} onChange={setDeadline} />
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[
                styles.sheetSubmitBtn,
                updatePoll.isPending && { backgroundColor: colors.disabled },
              ]}
              onPress={handleSubmit}
              disabled={updatePoll.isPending}
              activeOpacity={0.8}
            >
              {updatePoll.isPending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.sheetSubmitText}>Simpan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Tab content ────────────────────────────────────────────────────────────

export function VotingTabContent({ tripId, isCreator }: { tripId: string; isCreator: boolean }) {
  const { data: pollsData, isLoading } = usePolls(tripId);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPoll, setEditingPoll] = useState<TripPoll | null>(null);
  const [lockedResult, setLockedResult] = useState<{ poll: TripPoll; result: string } | null>(null);

  const polls = useMemo(() => {
    const list = pollsData?.data ?? [];
    return list.sort((a, b) => {
      const oa = POLL_TYPE_ORDER.indexOf(a.poll_type);
      const ob = POLL_TYPE_ORDER.indexOf(b.poll_type);
      // Urut jenis dulu, lalu terbaru di atas dalam jenis yang sama.
      return oa - ob || b.created_at.localeCompare(a.created_at);
    });
  }, [pollsData]);

  const ongoingTypes = useMemo(
    () => polls.filter((p) => p.status === 'active').map((p) => p.poll_type),
    [polls],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.coral} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {polls.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <ListChecks size={32} color={colors.teal} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada voting</Text>
            <Text style={styles.emptyDesc}>
              Buat voting aktivitas, transportasi, atau keputusan lain untuk anggota trip.
            </Text>
          </View>
        ) : (
          <View style={styles.pollsList}>
            {polls.map((poll) => (
              <VotingCollapseSection
                key={poll.id}
                poll={poll}
                tripId={tripId}
                isCreator={isCreator}
                onEdit={setEditingPoll}
                onLocked={(p, result) => setLockedResult({ poll: p, result })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.createFab}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.8}
      >
        <Plus size={16} color={colors.white} />
        <Text style={styles.createFabText}>Buat Voting Baru</Text>
      </TouchableOpacity>

      <CreateVotingSheet
        visible={showCreate}
        tripId={tripId}
        ongoingTypes={ongoingTypes}
        onClose={() => setShowCreate(false)}
      />

      <EditVotingSheet
        visible={editingPoll !== null}
        tripId={tripId}
        poll={editingPoll}
        onClose={() => setEditingPoll(null)}
      />

      {lockedResult && (
        <VotingLockedModal
          visible
          type={lockedResult.poll.poll_type}
          title={lockedResult.poll.title}
          resultValue={lockedResult.result}
          hint={
            lockedResult.poll.poll_type === 'tanggal'
              ? 'Tanggal resmi trip diperbarui. Card voting tetap ada dengan badge Selesai.'
              : lockedResult.poll.poll_type === 'aktivitas'
                ? 'Aktivitas ditambahkan ke itinerary.'
                : ''
          }
          onClose={() => setLockedResult(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 80, gap: 10, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 8,
  },
  emptyDesc: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  pollsList: { gap: 10 },
  // Collapse card
  collapseCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'visible',
  },
  collapseCardEnded: { opacity: 0.92 },
  collapseCardMenuOpen: { zIndex: 60, elevation: 12 },
  collapseHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingLeft: 16 },
  collapseHeaderMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  collapseIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  collapseInfo: { flex: 1, minWidth: 0 },
  collapseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  collapseTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    flexShrink: 1,
  },
  collapseSubtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 2,
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusBadgeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  menuBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    marginLeft: 4,
  },
  menuBtnOpen: { backgroundColor: colors.coralLight, borderWidth: 1.5, borderColor: colors.coral },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: { ...StyleSheet.absoluteFill, zIndex: 40 },
  menuDropdown: {
    position: 'absolute',
    top: 52,
    right: 12,
    width: 176,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  menuItemText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  menuDivider: { height: 1, backgroundColor: colors.border },
  collapseBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Candidate row
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  candidateCardVoted: { borderColor: colors.coral },
  candidateCardWinner: { backgroundColor: colors.coralLight, borderColor: colors.coral },
  candidateCardReadOnly: { opacity: 0.75 },
  candidateInfo: { flex: 1 },
  candidateLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  candidateMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  candidateLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  candidateLinkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '100%',
  },
  candidateLinkText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
    flexShrink: 1,
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  voteCount: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  voteCountActive: { color: colors.coral },
  winnerText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  votedText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  voteBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  voteBtnDisabled: { opacity: 0.6 },
  voteBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  voterAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voterAvatarImage: {
    width: '100%',
    height: '100%',
  },
  voterAvatarLetter: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
   createFab: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 50,
    backgroundColor: colors.coral,
    borderRadius: 14,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 6,
  },
  createFabText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Locked result modal
  lockedBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  lockedCard: {
    width: '100%',
    maxWidth: 288,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 56,
    elevation: 12,
  },
  lockedClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 10,
  },
  lockedTypeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  lockedTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 12,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  lockedResultBox: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 11,
    paddingHorizontal: 13,
    marginBottom: 10,
  },
  lockedResultLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  lockedResultValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    lineHeight: 19,
  },
  lockedHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 17,
    marginBottom: 14,
  },
  lockedOk: {
    height: 42,
    backgroundColor: colors.coral,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedOkText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(26,26,46,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    ...bottomSheetFrame,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sheetBackBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { flex: 1 },
  sheetBodyContent: { padding: 20, paddingTop: 8, gap: 12 },
  sheetSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 4,
  },
  sheetLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    marginTop: 6,
  },
  sheetInput: {
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
  sheetFooter: { padding: 20, paddingTop: 8 },
  sheetSubmitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSubmitText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
  },
  typeOptionDisabled: { opacity: 0.55 },
  typeOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeOptionInfo: { flex: 1, minWidth: 0 },
  typeOptionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  typeOptionLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  ongoingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.light,
  },
  ongoingBadgeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  typeOptionDesc: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 16,
    marginTop: 3,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  typeBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  typeBadgeInlineText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.light,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCheck: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 12,
    gap: 10,
  },
  optionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionLinkField: {
    gap: 5,
  },
  optionLinkLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  optionLinkInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    minWidth: 0,
  },
  optionLinkInput: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: 11,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
  },
  optionRefGroup: {
    gap: 4,
    marginTop: 2,
  },
  optionRefIndex: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  optionRefSubLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
  },
  optionAddLinkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  optionAddLinkBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.coral,
  },
  optionInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', minWidth: 0 },
  addOptionBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCandidateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  addCandidateBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.coral,
  },
  // Date picker calendar
  dpCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 12,
    marginTop: 4,
  },
  dpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dpNav: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpMonth: { fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  dpWeekRow: { flexDirection: 'row', marginBottom: 4 },
  dpWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  dpGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dpCell: { width: '14.28%', alignItems: 'center', paddingVertical: 2 },
  dpDay: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dpDaySelected: { backgroundColor: colors.coral },
  dpDayInRange: { backgroundColor: colors.coralLight },
  dpDayText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.charcoal },
  dpDayTextSelected: { color: colors.white, fontFamily: 'PlusJakartaSans_700Bold' },
  dpDayTextInRange: { color: colors.coral, fontFamily: 'PlusJakartaSans_700Bold' },
  dpHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  // Deadline field (konsisten form buat perjalanan)
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
  deadlineBoxOpen: { borderColor: colors.coral, borderWidth: 2 },
  deadlineText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  deadlinePlaceholder: { color: colors.mutedLight, fontFamily: 'PlusJakartaSans_400Regular' },
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
  deadlineTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  deadlineTimeLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
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
  deadlineTimeValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  deadlineTimeHint: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
    lineHeight: 14,
  },
  timeInputBoxFocused: { borderColor: colors.coral, borderWidth: 2 },
});
