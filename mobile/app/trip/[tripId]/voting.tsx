import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { usePolls } from '@/features/voting/hooks/usePolls';
import { useCreatePoll } from '@/features/voting/hooks/useCreatePoll';
import { useVote } from '@/features/voting/hooks/useVote';
import { useLockPoll } from '@/features/voting/hooks/useLockPoll';
import { useDeletePoll } from '@/features/voting/hooks/useDeletePoll';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Calendar } from '@/components/icons/Calendar';
import { MapPin } from '@/components/icons/MapPin';
import { ListChecks } from '@/components/icons/ListChecks';
import { Plus } from '@/components/icons/Plus';
import { Trash2 } from '@/components/icons/Trash2';
import { ThumbsUp } from '@/components/icons/ThumbsUp';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import { useAuth } from '@/auth/AuthProvider';
import type { TripPoll, PollOption } from '@atur-perjalanan/shared-types';

const POLL_TYPE_META: Record<string, { label: string; color: string; bg: string; icon: typeof Calendar }> = {
  tanggal: { label: 'Tanggal', color: colors.coral, bg: colors.coralLight, icon: Calendar },
  aktivitas: { label: 'Aktivitas', color: colors.teal, bg: colors.tealLight, icon: MapPin },
  lainnya: { label: 'Lainnya', color: colors.muted, bg: colors.light, icon: ListChecks },
};

function VotingCandidateRow({
  option,
  poll,
  onVote,
  onRetract,
}: {
  option: PollOption;
  poll: TripPoll;
  onVote: () => void;
  onRetract: () => void;
}) {
  const isVoted = (poll as any).voted_option_id === option.id;
  const winnerOption = poll.options.reduce((a, b) => (b.vote_count > a.vote_count ? b : a), poll.options[0]);
  const isWinner = poll.status === 'locked' && winnerOption?.id === option.id;
  const isReadOnly = poll.status === 'locked' || poll.status === 'cancelled';

  return (
    <View style={[styles.candidateCard, isVoted && styles.candidateCardVoted, isWinner && styles.candidateCardWinner]}>
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateLabel}>{option.label}</Text>
        <View style={styles.candidateMeta}>
          <View style={styles.votePill}>
            <ThumbsUp size={10} color={isVoted || isWinner ? colors.coral : colors.muted} />
            <Text style={[styles.voteCount, (isVoted || isWinner) && styles.voteCountActive]}>
              {option.vote_count}
            </Text>
          </View>
          {isWinner && <Text style={styles.winnerText}>Pemenang</Text>}
          {isVoted && !isWinner && <Text style={styles.votedText}>✓ Voted</Text>}
        </View>
      </View>
      {!isReadOnly && (
        isVoted ? (
          <TouchableOpacity style={styles.voteBtn} onPress={onRetract}>
            <Text style={styles.voteBtnText}>Batal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.voteBtn} onPress={onVote}>
            <Text style={styles.voteBtnText}>Vote</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

function VotingCollapseSection({
  poll,
  tripId,
  isCreator,
}: {
  poll: TripPoll;
  tripId: string;
  isCreator: boolean;
}) {
  const [expanded, setExpanded] = useState(poll.status === 'active');
  const [showMenu, setShowMenu] = useState(false);
  const { vote, retractVote } = useVote(tripId);
  const lockPoll = useLockPoll(tripId);
  const deletePoll = useDeletePoll(tripId);

  const meta = POLL_TYPE_META[poll.poll_type] ?? POLL_TYPE_META.lainnya;
  const IconComponent = meta.icon;
  const totalVotes = poll.options.reduce((sum, o) => sum + o.vote_count, 0);

  const handleLock = useCallback(() => {
    setShowMenu(false);
    Alert.alert(
      'Akhiri Voting?',
      `Voting "${poll.title}" akan dikunci.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Akhiri', style: 'destructive', onPress: () => lockPoll.mutate(poll.id) },
      ],
    );
  }, [poll, lockPoll]);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    Alert.alert(
      'Hapus Voting?',
      `Voting "${poll.title}" akan dihapus.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deletePoll.mutate(poll.id) },
      ],
    );
  }, [poll, deletePoll]);

  return (
    <View style={styles.collapseCard}>
      <TouchableOpacity
        style={styles.collapseHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={[styles.collapseIconBox, { backgroundColor: meta.bg }]}>  
          <IconComponent size={17} color={meta.color} />
        </View>
        <View style={styles.collapseInfo}>
          <Text style={styles.collapseTitle}>{poll.title}</Text>
          <Text style={styles.collapseSubtitle}>
            {poll.status === 'active' ? `${totalVotes} vote` : poll.status === 'locked' ? 'Selesai' : 'Berakhir'}
          </Text>
        </View>

        {poll.status === 'locked' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Selesai</Text>
          </View>
        )}

        {isCreator && poll.status === 'active' && (
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <Text style={{ fontSize: 16, color: colors.muted }}>⋯</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLock}>
            <Text style={[styles.menuItemText, { color: colors.coral }]}>Akhiri Voting</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
            <Trash2 size={15} color={colors.danger} />
            <Text style={[styles.menuItemText, { color: colors.danger }]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded && (
        <View style={styles.collapseBody}>
          {poll.options
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((option) => (
              <VotingCandidateRow
                key={option.id}
                option={option}
                poll={poll}
                onVote={() => vote.mutate({ pollId: poll.id, optionId: option.id })}
                onRetract={() => retractVote.mutate(poll.id)}
              />
            ))}
        </View>
      )}
    </View>
  );
}

function CreateVotingSheet({
  visible,
  tripId,
  onClose,
}: {
  visible: boolean;
  tripId: string;
  onClose: () => void;
}) {
  const createPoll = useCreatePoll(tripId);
  const [pollType, setPollType] = useState<'aktivitas' | 'lainnya'>('aktivitas');
  const [title, setTitle] = useState('');
  const [optionText, setOptionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const addOption = useCallback(() => {
    const trimmed = optionText.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions((prev) => [...prev, trimmed]);
      setOptionText('');
    }
  }, [optionText, options]);

  const removeOption = useCallback((opt: string) => {
    setOptions((prev) => prev.filter((o) => o !== opt));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || options.length < 2) {
      Alert.alert('Validasi', 'Judul dan minimal 2 kandidat wajib diisi');
      return;
    }
    try {
      await createPoll.mutateAsync({
        poll_type: pollType,
        title: title.trim(),
        options,
      });
      setTitle('');
      setOptions([]);
      setOptionText('');
      onClose();
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat membuat voting');
    }
  }, [title, options, pollType, createPoll, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Buat Voting</Text>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <Text style={{ fontSize: 18, color: colors.muted }}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sheetBody} contentContainerStyle={styles.sheetBodyContent}>
            {/* Type selector */}
            <View style={styles.typeRow}>
              {(['aktivitas', 'lainnya'] as const).map((t) => {
                const m = POLL_TYPE_META[t];
                const active = pollType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, active && { backgroundColor: m.bg, borderColor: m.color }]}
                    onPress={() => setPollType(t)}
                  >
                    <Text style={[styles.typeChipText, active && { color: m.color }]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Title */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Judul Voting *</Text>
              <TextInput
                style={styles.sheetInput}
                placeholder="Contoh: Destinasi Hari ke-2"
                placeholderTextColor={colors.mutedLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Options */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Kandidat *</Text>
              {options.map((opt, i) => (
                <View key={i} style={styles.optionRow}>
                  <Text style={styles.optionText}>{opt}</Text>
                  <TouchableOpacity onPress={() => removeOption(opt)}>
                    <Text style={{ color: colors.muted, fontSize: 16 }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.optionInputRow}>
                <TextInput
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
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[styles.sheetSubmitBtn, createPoll.isPending && { backgroundColor: colors.disabled }]}
              onPress={handleSubmit}
              disabled={createPoll.isPending}
            >
              <Text style={styles.sheetSubmitText}>
                {createPoll.isPending ? 'Membuat...' : 'Buat Voting'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function VotingScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: trip, isLoading: tripLoading } = useTripDetail(tripId);
  const { data: pollsData, isLoading: pollsLoading } = usePolls(tripId);
  const [showCreate, setShowCreate] = useState(false);

  const polls = pollsData?.data ?? [];
  const isLoading = tripLoading || pollsLoading;
  const { user } = useAuth();
  const isCreator = trip?.creator?.id === user?.id;

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{trip?.name}</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push(`/trip/${tripId}`)}>
          <Text style={styles.tabText}>Itinerary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Voting</Text>
          <View style={styles.tabUnderlineActive} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push(`/trip/${tripId}/chat`)}>
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push(`/trip/${tripId}/media`)}>
          <Text style={styles.tabText}>Media</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.emptyDesc}>Buat voting untuk memutuskan bersama anggota trip.</Text>
          </View>
        ) : (
          <View style={styles.pollsList}>
            {polls.map((poll) => (
              <VotingCollapseSection
                key={poll.id}
                poll={poll}
                tripId={tripId}
                isCreator={isCreator}
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.createFab} onPress={() => setShowCreate(true)} activeOpacity={0.8}>
          <Plus size={16} color={colors.white} />
          <Text style={styles.createFabText}>Buat Voting Baru</Text>
        </TouchableOpacity>
      </ScrollView>

      <CreateVotingSheet
        visible={showCreate}
        tripId={tripId}
        onClose={() => setShowCreate(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginHorizontal: 10 },
  headerTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  tabs: { flexDirection: 'row', marginHorizontal: 14, borderBottomWidth: 1.5, borderBottomColor: colors.border },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 16, paddingBottom: 10 },
  tabActive: { position: 'relative' },
  tabText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  tabTextActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  tabUnderlineActive: { position: 'absolute', bottom: -1.5, left: 0, right: 0, height: 2.5, backgroundColor: colors.coral, borderRadius: 2 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40, gap: 10 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIconBox: { width: 72, height: 72, borderRadius: 22, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginBottom: 8 },
  emptyDesc: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  pollsList: { gap: 10 },
  collapseCard: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 12, elevation: 3, overflow: 'visible' },
  collapseHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingLeft: 16 },
  collapseIconBox: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  collapseInfo: { flex: 1 },
  collapseTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  collapseSubtitle: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.light, marginRight: 8 },
  statusBadgeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  menuBtn: { padding: 8, marginRight: 4 },
  chevron: { fontSize: 10, color: colors.muted },
  menuDropdown: { position: 'absolute', top: 56, right: 12, backgroundColor: colors.white, borderRadius: 12, paddingVertical: 4, zIndex: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 32, elevation: 10, borderWidth: 1, borderColor: colors.border, width: 176 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  menuItemText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold' },
  menuDivider: { height: 1, backgroundColor: colors.border },
  collapseBody: { paddingHorizontal: 16, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.border },
  candidateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light, borderRadius: 12, padding: 12, paddingHorizontal: 14, marginTop: 8, borderWidth: 1.5, borderColor: colors.border },
  candidateCardVoted: { borderColor: colors.coral },
  candidateCardWinner: { backgroundColor: colors.coralLight, borderColor: colors.coral },
  candidateInfo: { flex: 1 },
  candidateLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  candidateMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  votePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  voteCount: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  voteCountActive: { color: colors.coral },
  winnerText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  votedText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  voteBtn: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  voteBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  createFab: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 50, backgroundColor: colors.coral, borderRadius: 14, shadowColor: colors.coral, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 22, elevation: 6, marginTop: 8 },
  createFabText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Create sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(26,26,46,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  sheetTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  sheetCloseBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  sheetBody: { flex: 1 },
  sheetBodyContent: { padding: 20, paddingTop: 8, gap: 16 },
  sheetField: { gap: 8 },
  sheetLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  sheetInput: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border },
  sheetFooter: { padding: 20, paddingTop: 8 },
  sheetSubmitBtn: { height: 50, borderRadius: 14, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  sheetSubmitText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  typeChipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.light, borderRadius: 12, padding: 12, paddingHorizontal: 14, borderWidth: 1.5, borderColor: colors.border },
  optionText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  optionInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addOptionBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.coralLight, alignItems: 'center', justifyContent: 'center' },
});
