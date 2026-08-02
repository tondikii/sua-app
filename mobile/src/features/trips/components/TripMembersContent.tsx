import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateInvitation } from '@/features/invitations/hooks/useCreateInvitation';
import { useCancelInvitation } from '@/features/invitations/hooks/useCancelInvitation';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { useMembers, type Member } from '@/features/trips/hooks/useMembers';
import { useRemoveMember } from '@/features/trips/hooks/useRemoveMember';
import { useLeaveTrip } from '@/features/trips/hooks/useLeaveTrip';
import { useToast } from '@/components/Toast';
import type { ManagedInvitation } from '@atur-perjalanan/shared-types';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Search } from '@/components/icons/Search';
import { X } from '@/components/icons/X';
import { Mail } from '@/components/icons/Mail';
import { Trash2 } from '@/components/icons/Trash2';
import { LogOut } from '@/components/icons/LogOut';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

/** Strict-enough email check: local@domain.tld — "sudutkode@" is rejected. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface TripMembersContentProps {
  tripId: string;
  isCreator: boolean;
  currentUserId: string;
}

/**
 * Content for the "Anggota Perjalanan" screen (Screen 97–102): invite search +
 * pending invitations + member list. Rendered inside a full screen by
 * `app/trip/[tripId]/members.tsx`.
 */
export function TripMembersContent({ tripId, isCreator, currentUserId }: TripMembersContentProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [removing, setRemoving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { data: membersData, isLoading } = useMembers(tripId);
  const createInvitation = useCreateInvitation(tripId);
  const cancelInvitation = useCancelInvitation(tripId);
  const removeMember = useRemoveMember(tripId);
  const leaveTrip = useLeaveTrip(tripId);

  const members: Member[] = membersData?.members ?? [];
  const invitations: ManagedInvitation[] = membersData?.invitations ?? [];
  const isCreatorView = isCreator || membersData?.is_creator === true;
  const isMember = members.some((m) => m.id === currentUserId);

  const isEmailQuery = EMAIL_RE.test(query.trim());
  const { data: searchData, isLoading: searchLoading } = useUserSearch(debouncedQuery);
  const searchResults = searchData?.data ?? [];

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const isAlreadyInvited = useCallback(
    (username: string) => {
      if (members.some((m) => m.username === username)) return true;
      return invitations.some(
        (inv) => inv.state !== 'rejected' && inv.invited_user?.username === username,
      );
    },
    [members, invitations],
  );

  const isTripMember = useCallback(
    (username: string) => members.some((m) => m.username === username),
    [members],
  );

  const handleInvite = useCallback((username: string, name: string) => {
    setPendingUsername(username);
    createInvitation.mutate(
      { username },
      {
        onSuccess: () => setPendingUsername(null),
        onError: () => setPendingUsername(null),
      },
    );
  }, [createInvitation]);

  const handleInviteEmail = useCallback((email: string) => {
    if (!EMAIL_RE.test(email.trim())) return;
    setPendingEmail(email.trim());
    createInvitation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => setPendingEmail(null),
        onError: () => setPendingEmail(null),
      },
    );
  }, [createInvitation]);

  const handleCancel = useCallback((invitationId: string) => {
    cancelInvitation.mutate(invitationId, {
      onError: () => showToast('Tidak dapat membatalkan undangan ini.'),
    });
  }, [cancelInvitation, showToast]);

  const handleRemove = useCallback((member: Member) => {
    setRemoveTarget(member);
  }, []);

  const handleConfirmRemove = useCallback(async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await removeMember.mutateAsync(removeTarget.id);
      setRemoving(false);
      setRemoveTarget(null);
    } catch {
      setRemoving(false);
      setRemoveTarget(null);
      showToast('Tidak dapat mengeluarkan anggota ini.');
    }
  }, [removeTarget, removeMember, showToast]);

  const handleConfirmLeave = useCallback(async () => {
    setLeaving(true);
    try {
      await leaveTrip.mutateAsync();
      setLeaving(false);
      setShowLeaveConfirm(false);
      // Leave the trip screen — back to home.
      router.replace('/(tabs)');
    } catch {
      setLeaving(false);
      setShowLeaveConfirm(false);
      showToast('Tidak dapat keluar dari perjalanan ini.');
    }
  }, [leaveTrip, router, showToast]);

  const showSearchResults = debouncedQuery.trim().length >= 2 && !isEmailQuery;

  return (
    <>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
        </View>
      ) : (
        <>
          {/* Search */}
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <Search size={16} color={query.length > 0 ? colors.coral : colors.muted} />
            <TextInput
              style={[styles.searchInput, webOutlineNone]}
              placeholder="Cari username atau email..."
              placeholderTextColor={colors.mutedLight}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setDebouncedQuery(''); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={14} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search results */}
          {debouncedQuery.trim().length > 0 && searchLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.coral} />
            </View>
          )}

          {showSearchResults && !searchLoading && searchResults.length > 0 && (
            <View style={styles.block}>
              <Text style={styles.countLabel}>{searchResults.length} hasil</Text>
              {searchResults.map((user, idx) => {
                const already = isAlreadyInvited(user.username);
                const isExistingMember = isTripMember(user.username);
                return (
                  <Row
                    key={user.id}
                    name={user.name}
                    subtitle={`@${user.username}`}
                    avatarBg={avatarColorFor(user.username)}
                    avatarUrl={user.avatar_url}
                    isLast={idx === searchResults.length - 1}
                    trailing={
                      already ? (
                        <Text style={styles.invitedBadgeText}>
                          {isExistingMember ? '✓ Anggota' : '✓ Terundang'}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          style={[styles.primaryBtn, pendingUsername === user.username && styles.primaryBtnDisabled]}
                          onPress={() => handleInvite(user.username, user.name)}
                          disabled={pendingUsername === user.username}
                          activeOpacity={0.7}
                        >
                          {pendingUsername === user.username ? (
                            <ActivityIndicator size="small" color={colors.white} />
                          ) : (
                            <Text style={styles.primaryBtnText}>Undang</Text>
                          )}
                        </TouchableOpacity>
                      )
                    }
                  />
                );
              })}
            </View>
          )}

          {isEmailQuery && !searchLoading && (
            <View style={styles.block}>
              <EmailInviteCard
                email={query.trim()}
                valid={EMAIL_RE.test(query.trim())}
                sending={pendingEmail === query.trim()}
                alreadyInvited={invitations.some((inv) => inv.invited_email === query.trim())}
                onInvite={() => handleInviteEmail(query.trim())}
              />
            </View>
          )}

          {/* Pending invitations */}
          {invitations.length > 0 && (
            <View style={styles.block}>
              <Text style={styles.countLabel}>{invitations.length} pending</Text>
              {invitations.map((inv, idx) => (
                <PendingRow
                  key={inv.id}
                  invitation={inv}
                  isLast={idx === invitations.length - 1}
                  onCancel={() => handleCancel(inv.id)}
                />
              ))}
            </View>
          )}

          {(debouncedQuery.trim().length > 0 || invitations.length > 0) && (
            <View style={styles.divider} />
          )}

          {/* Members */}
          <Text style={styles.countLabel}>{members.length} anggota</Text>
          {members.map((member, idx) => {
            const isSelf = member.id === currentUserId;
            const roleLabel = member.role === 'creator' ? 'Pembuat' : 'Anggota';
            const roleBg = colors.light;
            const canRemove = isCreatorView && member.role !== 'creator';
            return (
              <Row
                key={member.id}
                name={isSelf ? `${member.name} (Kamu)` : member.name}
                subtitle={`@${member.username}`}
                avatarBg={avatarColorFor(member.username)}
                avatarUrl={member.avatar_url}
                isLast={idx === members.length - 1}
                trailing={
                  canRemove ? (
                    <TouchableOpacity style={styles.outlineBtn} onPress={() => handleRemove(member)} activeOpacity={0.7}>
                      <Text style={styles.outlineBtnText}>Keluarkan</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.roleBadge, { backgroundColor: roleBg }]}>
                      <Text style={[styles.roleBadgeText, { color: colors.muted }]}>{roleLabel}</Text>
                    </View>
                  )
                }
              />
            );
          })}

          {/* Leave trip — shown to non-creator members */}
          {isMember && !isCreatorView && (
            <TouchableOpacity
              style={styles.leaveBtn}
              onPress={() => setShowLeaveConfirm(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.leaveBtnText}>Keluar dari Perjalanan</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      </ScrollView>

      {/* Remove member confirmation modal */}
      <ConfirmModal
        visible={removeTarget !== null}
        title="Keluarkan anggota?"
        description={
          removeTarget ? (
            <>
              <Text style={{ color: colors.charcoal, fontFamily: 'PlusJakartaSans_700Bold' }}>
                {removeTarget.name}
              </Text>{' '}
              akan dikeluarkan dari trip.
            </>
          ) : (
            ''
          )
        }
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Keluarkan"
        destructive
        loading={removing}
        onConfirm={() => void handleConfirmRemove()}
        onCancel={() => setRemoveTarget(null)}
      />

      {/* Leave trip confirmation modal */}
      <ConfirmModal
        visible={showLeaveConfirm}
        title="Keluar dari perjalanan?"
        description="Kamu tidak akan lagi melihat perjalanan ini dan datanya di akunmu."
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Keluar"
        destructive
        loading={leaving}
        onConfirm={() => void handleConfirmLeave()}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </>
  );
}

function Row({
  name,
  subtitle,
  avatarBg,
  avatarUrl,
  isLast,
  trailing,
}: {
  name: string;
  subtitle: string;
  avatarBg: string;
  avatarUrl?: string | null;
  isLast: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{name}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {trailing}
    </View>
  );
}

function EmailInviteCard({
  email,
  valid,
  sending,
  alreadyInvited,
  onInvite,
}: {
  email: string;
  valid: boolean;
  sending: boolean;
  alreadyInvited: boolean;
  onInvite: () => void;
}) {
  return (
    <View style={styles.emailCard}>
      <View style={styles.emailCardHeader}>
        <View style={styles.emailIconBox}>
          <Mail size={20} color={colors.muted} />
        </View>
        <View style={styles.emailInfo}>
          <Text style={styles.emailAddress} numberOfLines={2}>{email}</Text>
          <Text style={styles.emailDesc}>
            Belum punya akun. Kami kirim undangan lewat email beserta link unduh app.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.emailCta, (!valid || sending || alreadyInvited) && styles.emailCtaDisabled]}
        onPress={onInvite}
        disabled={!valid || sending || alreadyInvited}
        activeOpacity={0.8}
      >
        {sending ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : alreadyInvited ? (
          <Text style={styles.emailCtaText}>Terkirim</Text>
        ) : (
          <Text style={styles.emailCtaText}>Undang lewat Email</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function PendingRow({
  invitation,
  isLast,
  onCancel,
}: {
  invitation: ManagedInvitation;
  isLast: boolean;
  onCancel: () => void;
}) {
  const user = invitation.invited_user;
  const isEmailOnly = invitation.state === 'email_sent';
  const isRejected = invitation.state === 'rejected';
  const meta = PENDING_META[invitation.state] ?? PENDING_META.email_sent;
  const displayName = user?.name ?? invitation.invited_email ?? '—';
  const subtitle =
    isRejected
      ? 'Undangan ditolak'
      : invitation.state === 'pending_accept' && user
        ? `@${user.username}`
        : isEmailOnly
          ? 'Belum daftar app'
          : (invitation.invited_email ?? meta.label);

  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.avatar, isEmailOnly ? styles.avatarEmail : { backgroundColor: user ? avatarColorFor(user.username) : colors.muted }]}>
        {isEmailOnly ? (
          <Mail size={20} color={colors.muted} />
        ) : (
          <Text style={styles.avatarLetter}>{(user?.name ?? '?').charAt(0)}</Text>
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, isRejected && { color: colors.muted }]} numberOfLines={1}>{displayName}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {isRejected ? (
        <TouchableOpacity style={styles.reinviteBtn} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.reinviteBtnText}>Undang kembali</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Batalkan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const PENDING_META: Record<string, { label: string; color: string; bg: string }> = {
  email_sent: { label: 'Belum daftar app', color: colors.muted, bg: colors.light },
  pending_accept: { label: 'Belum menerima', color: colors.coral, bg: colors.coralLight },
  rejected: { label: 'Ditolak', color: colors.danger, bg: colors.dangerLight },
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 8,
  },
  searchBarFocused: {
    borderColor: colors.coral,
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
  },
  block: {
    marginBottom: 4,
  },
  countLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
    marginTop: 12,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  leaveBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(249,65,65,0.3)',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  leaveBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.danger,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  avatarEmail: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 2,
  },
  invitedBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.teal,
    flexShrink: 0,
  },
  primaryBtn: {
    height: 34,
    paddingHorizontal: 16,
    backgroundColor: colors.coral,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 76,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  primaryBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  outlineBtn: {
    height: 32,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cancelBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(249,65,65,0.25)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.danger,
  },
  reinviteBtn: {
    height: 34,
    paddingHorizontal: 12,
    backgroundColor: colors.coral,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reinviteBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  emailCard: {
    backgroundColor: colors.light,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 12,
  },
  emailCardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  emailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailInfo: {
    flex: 1,
    minWidth: 0,
  },
  emailAddress: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 4,
  },
  emailDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 18,
  },
  emailCta: {
    height: 44,
    backgroundColor: colors.coral,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailCtaDisabled: {
    backgroundColor: colors.disabled,
  },
  emailCtaText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
