import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useCreateInvitation } from '@/features/invitations/hooks/useCreateInvitation';
import { useCancelInvitation } from '@/features/invitations/hooks/useCancelInvitation';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { useMembers } from '@/features/trips/hooks/useMembers';
import type { ManagedInvitation } from '@atur-perjalanan/shared-types';
import { Search } from '@/components/icons/Search';
import { X } from '@/components/icons/X';
import { CheckCircle } from '@/components/icons/CheckCircle';
import { Mail } from '@/components/icons/Mail';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

/** Strict-enough email check: local@domain.tld — "sudutkode@" is rejected. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface InviteBottomSheetProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
  onEnterTrip: () => void;
}

interface InvitedUser {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
}

interface EmailInvite {
  email: string;
  invitationId: string | null;
  /** Whether the invitation email was actually delivered (SMTP). */
  delivered: boolean;
}

export function InviteBottomSheet({ visible, tripId, onClose, onEnterTrip }: InviteBottomSheetProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [invited, setInvited] = useState<InvitedUser[]>([]);
  const [emailInvites, setEmailInvites] = useState<EmailInvite[]>([]);
  const [emailSentBanner, setEmailSentBanner] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);

  const createInvitation = useCreateInvitation(tripId);
  const cancelInvitation = useCancelInvitation(tripId);
  const { data: membersData } = useMembers(tripId);

  const isEmailQuery = EMAIL_RE.test(query.trim());
  const { data, isLoading: searchLoading } = useUserSearch(debouncedQuery);
  const results = data?.data ?? [];

  // Existing pending/declined invitations for this trip (from members endpoint).
  const existingInvitations: ManagedInvitation[] = membersData?.invitations ?? [];

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset transient state when the sheet opens.
  useEffect(() => {
    if (visible) {
      setQuery('');
      setDebouncedQuery('');
      setEmailSentBanner(null);
      setInlineError(null);
      setPendingEmail(null);
      setPendingUsername(null);
    }
  }, [visible]);

  const handleInvite = useCallback((username: string, name: string) => {
    setPendingUsername(username);
    createInvitation.mutate(
      { username },
      {
        onSuccess: () => {
          setInvited((prev) => [...prev, { id: username, name, username, avatar_url: null }]);
          setInlineError(null);
          setPendingUsername(null);
        },
        onError: (err: Error) => {
          setPendingUsername(null);
          const message = err instanceof Error ? err.message : 'Tidak dapat mengundang pengguna ini.';
          setInlineError(message);
        },
      },
    );
  }, [createInvitation]);

  const handleInviteEmail = useCallback((email: string) => {
    if (!EMAIL_RE.test(email.trim())) {
      setInlineError('Email tidak valid. Pastikan formatnya benar, contoh: nama@domain.com');
      return;
    }
    setPendingEmail(email.trim());
    createInvitation.mutate(
      { email: email.trim() },
      {
        onSuccess: (inv) => {
          setEmailInvites((prev) => [
            ...prev,
            { email: email.trim(), invitationId: inv.id, delivered: inv.email_delivered },
          ]);
          setEmailSentBanner(email.trim());
          setQuery('');
          setDebouncedQuery('');
          setInlineError(null);
          setPendingEmail(null);
        },
        onError: (err: Error) => {
          setPendingEmail(null);
          const message = err instanceof Error ? err.message : 'Tidak dapat mengirim undangan ke email ini.';
          setInlineError(message);
        },
      },
    );
  }, [createInvitation]);

  const handleRemoveEmail = useCallback((invite: EmailInvite) => {
    if (invite.invitationId) {
      cancelInvitation.mutate(invite.invitationId, {
        onSuccess: () => {
          setEmailInvites((prev) => prev.filter((e) => e.email !== invite.email));
        },
        onError: () => {
          Alert.alert('Gagal', 'Tidak dapat membatalkan undangan email ini.');
        },
      });
    } else {
      setEmailInvites((prev) => prev.filter((e) => e.email !== invite.email));
    }
  }, [cancelInvitation]);

  const handleCancelExisting = useCallback((invitationId: string) => {
    cancelInvitation.mutate(invitationId, {
      onError: () => Alert.alert('Gagal', 'Tidak dapat membatalkan undangan ini.'),
    });
  }, [cancelInvitation]);

  const isInvitedUser = useCallback((username: string) => {
    if (invited.some((u) => u.username === username)) return true;
    return existingInvitations.some(
      (inv) => inv.state !== 'rejected' && inv.invited_user?.username === username,
    );
  }, [invited, existingInvitations]);

  const showIdle = !debouncedQuery.trim();
  const showResults = debouncedQuery.trim().length >= 2 && !isEmailQuery;

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderSpacer} />
          <Text style={styles.sheetTitle}>Undang Teman</Text>
          <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
            <X size={18} color={colors.charcoal} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <Search size={16} color={query.length > 0 ? colors.coral : colors.muted} />
            <TextInput
              style={[styles.searchInput, webOutlineNone]}
              placeholder="Cari username / email..."
              placeholderTextColor={colors.mutedLight}
              value={query}
              onChangeText={(t) => { setQuery(t); setInlineError(null); }}
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
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showIdle ? (
            <IdleSection
              emailSentBanner={emailSentBanner}
              invited={invited}
              emailInvites={emailInvites}
              existingInvitations={existingInvitations}
              onRemoveEmail={handleRemoveEmail}
              onCancelExisting={handleCancelExisting}
            />
          ) : searchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.coral} />
            </View>
          ) : isEmailQuery ? (
            <EmailInviteCard
              email={query.trim()}
              valid={EMAIL_RE.test(query.trim())}
              sending={pendingEmail === query.trim()}
              alreadyInvited={emailInvites.some((e) => e.email === query.trim())}
              onInvite={() => handleInviteEmail(query.trim())}
            />
          ) : results.length > 0 ? (
            <View>
              <Text style={styles.countLabel}>{results.length} hasil</Text>
              {results.map((user, idx) => {
                const already = isInvitedUser(user.username);
                return (
                  <InviteUserRow
                    key={user.id}
                    name={user.name}
                    username={user.username}
                    avatarUrl={user.avatar_url}
                    invited={already}
                    sending={pendingUsername === user.username}
                    isLast={idx === results.length - 1}
                    onInvite={() => handleInvite(user.username, user.name)}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Search size={32} color={colors.muted} />
              </View>
              <Text style={styles.emptyTitle}>Tidak ditemukan</Text>
              <Text style={styles.emptyDesc}>
                Coba cari dengan nama lengkap atau username yang berbeda.
              </Text>
            </View>
          )}

          {inlineError && (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{inlineError}</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerBtn} onPress={onEnterTrip} activeOpacity={0.8}>
            <Text style={styles.footerBtnText}>Masuk ke Perjalanan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function IdleSection({
  emailSentBanner,
  invited,
  emailInvites,
  existingInvitations,
  onRemoveEmail,
  onCancelExisting,
}: {
  emailSentBanner: string | null;
  invited: InvitedUser[];
  emailInvites: EmailInvite[];
  existingInvitations: ManagedInvitation[];
  onRemoveEmail: (invite: EmailInvite) => void;
  onCancelExisting: (invitationId: string) => void;
}) {
  const hasInvited = invited.length > 0 || emailInvites.length > 0 || existingInvitations.length > 0;

  if (!hasInvited) {
    return (
      <Text style={styles.helperText}>
        Cari teman dengan username atau email untuk diajak bergabung.
      </Text>
    );
  }

  const pendingExisting = existingInvitations.filter((inv) => inv.state !== 'rejected');

  return (
    <View>
      {emailSentBanner && (
        <View style={styles.sentBanner}>
          <View style={styles.sentBannerIcon}>
            <CheckCircle size={20} color={colors.teal} />
          </View>
          <View style={styles.sentBannerContent}>
            <Text style={styles.sentBannerTitle}>Email terkirim</Text>
            <Text style={styles.sentBannerDesc}>
              Undangan dikirim ke <Text style={styles.sentBannerStrong}>{emailSentBanner}</Text>.
              Tunggu unduh app lalu terima dari beranda.
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>Sudah diundang</Text>

      {emailInvites.map((invite) => (
        <EmailInvitedRow
          key={invite.email}
          email={invite.email}
          subtitle={invite.delivered ? 'Undangan terkirim' : 'Undangan tersimpan (email belum dikirim)'}
          onCancel={() => onRemoveEmail(invite)}
        />
      ))}

      {pendingExisting.map((inv) => (
        <PendingInviteRow
          key={inv.id}
          invitation={inv}
          onCancel={() => onCancelExisting(inv.id)}
        />
      ))}

      {invited.map((user) => (
        <InviteUserRow
          key={user.username}
          name={user.name}
          username={user.username}
          avatarUrl={user.avatar_url}
          invited
        />
      ))}
    </View>
  );
}

function InviteUserRow({
  name,
  username,
  avatarUrl,
  invited,
  sending,
  isLast,
  onInvite,
}: {
  name: string;
  username: string;
  avatarUrl: string | null;
  invited: boolean;
  sending?: boolean;
  isLast?: boolean;
  onInvite?: () => void;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.avatar, { backgroundColor: avatarColorFor(username) }]}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{name}</Text>
        <Text style={styles.rowSubtitle}>@{username}</Text>
      </View>
      {invited ? (
        <Text style={styles.invitedBadgeText}>✓ Terundang</Text>
      ) : (
        <TouchableOpacity
          style={[styles.primaryBtn, sending && styles.primaryBtnDisabled]}
          onPress={onInvite}
          disabled={sending}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Undang</Text>
          )}
        </TouchableOpacity>
      )}
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
      {!valid && (
        <Text style={styles.emailHint}>Email belum lengkap — contoh format: nama@domain.com</Text>
      )}
    </View>
  );
}

function EmailInvitedRow({
  email,
  subtitle,
  onCancel,
}: {
  email: string;
  subtitle: string;
  onCancel: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, styles.avatarEmail]}>
        <Mail size={20} color={colors.muted} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{email}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
        <Text style={styles.cancelBtnText}>Batalkan</Text>
      </TouchableOpacity>
    </View>
  );
}

function PendingInviteRow({
  invitation,
  onCancel,
}: {
  invitation: ManagedInvitation;
  onCancel: () => void;
}) {
  const user = invitation.invited_user;
  const isEmailOnly = invitation.state === 'email_sent';
  const displayName = user?.name ?? invitation.invited_email ?? '—';
  const subtitle =
    invitation.state === 'pending_accept'
      ? user ? `@${user.username}` : 'Belum menerima'
      : 'Belum daftar app';

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, isEmailOnly ? styles.avatarEmail : { backgroundColor: user ? avatarColorFor(user.username) : colors.muted }]}>
        {isEmailOnly ? (
          <Mail size={20} color={colors.muted} />
        ) : (
          <Text style={styles.avatarLetter}>{(user?.name ?? '?').charAt(0)}</Text>
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{displayName}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
        <Text style={styles.cancelBtnText}>Batalkan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26,26,46,0.45)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '88%',
    ...Platform.select({
      web: { position: 'fixed' as any, bottom: 0, left: 0, right: 0, maxWidth: 430, marginHorizontal: 'auto' },
      default: {},
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  sheetHeaderSpacer: { width: 36 },
  sheetTitle: {
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 22,
    paddingBottom: 12,
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
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  helperText: {
    ...typography.body,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingVertical: 32,
  },
  countLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
    marginTop: 12,
    marginBottom: 4,
  },
  // Rows
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
  cancelBtn: {
    height: 34,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
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
  // Email card (Screen 39)
  emailCard: {
    backgroundColor: colors.light,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 4,
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
  emailHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  // Banner (Screen 40)
  sentBanner: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: colors.tealLight,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(78,205,196,0.2)',
    marginBottom: 4,
  },
  sentBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentBannerContent: {
    flex: 1,
  },
  sentBannerTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 4,
  },
  sentBannerDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 18,
  },
  sentBannerStrong: {
    color: colors.charcoal,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  // Empty state (Screen 38)
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 6,
  },
  emptyDesc: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  inlineError: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  inlineErrorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.danger,
    textAlign: 'center',
  },
  footer: {
    padding: 22,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 8,
  },
  footerBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
});
