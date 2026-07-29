import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateInvitation } from '@/features/invitations/hooks/useCreateInvitation';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { Search } from '@/components/icons/Search';
import { X } from '@/components/icons/X';
import { Check } from '@/components/icons/Check';
import { Plus } from '@/components/icons/Plus';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

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

export function InviteBottomSheet({ visible, tripId, onClose, onEnterTrip }: InviteBottomSheetProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [invited, setInvited] = useState<InvitedUser[]>([]);
  const [emailInvites, setEmailInvites] = useState<string[]>([]);
  const createInvitation = useCreateInvitation(tripId);

  const { data, isLoading } = useUserSearch(debouncedQuery);
  const results = data?.data ?? [];

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleInvite = useCallback((username: string, name: string) => {
    createInvitation.mutate(
      { username },
      {
        onSuccess: () => {
          setInvited((prev) => [...prev, { id: username, name, username, avatar_url: null }]);
        },
        onError: () => {
          Alert.alert('Gagal', 'Tidak dapat mengundang pengguna ini.');
        },
      },
    );
  }, [createInvitation]);

  const handleInviteEmail = useCallback((email: string) => {
    createInvitation.mutate(
      { email },
      {
        onSuccess: () => {
          setEmailInvites((prev) => [...prev, email]);
          setQuery('');
          setDebouncedQuery('');
        },
        onError: () => {
          Alert.alert('Gagal', 'Tidak dapat mengirim undangan ke email ini.');
        },
      },
    );
  }, [createInvitation]);

  const isInvitedUser = useCallback((username: string) => {
    return invited.some((u) => u.username === username);
  }, [invited]);

  const showIdle = !debouncedQuery.trim();
  const showResults = debouncedQuery.trim().length >= 2;

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
          <View style={styles.searchBar}>
            <Search size={16} color={query.length > 0 ? colors.coral : colors.muted} />
            <TextInput
              style={[styles.searchInput, webOutlineNone]}
              placeholder="Cari username / email..."
              placeholderTextColor={colors.mutedLight}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setDebouncedQuery(''); }}>
                <X size={14} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        <FlatList
          data={showResults && !isLoading ? results : []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            showIdle ? (
              <View style={styles.emptyState}>
                {invited.length > 0 || emailInvites.length > 0 ? (
                  <InvitedList
                    emailInvites={emailInvites}
                    onRemoveEmail={(email) => setEmailInvites((p) => p.filter((e) => e !== email))}
                  />
                ) : (
                  <Text style={styles.helperText}>
                    Cari teman dengan username atau email untuk diajak bergabung.
                  </Text>
                )}
              </View>
            ) : isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.coral} />
              </View>
            ) : results.length === 0 ? (
              <View style={styles.emptyState}>
                {/* Check if query looks like an email */}
                {query.includes('@') ? (
                  <View style={styles.emailOption}>
                    <View style={styles.emailIconContainer}>
                      <Plus size={20} color={colors.teal} />
                    </View>
                    <View style={styles.emailInfo}>
                      <Text style={styles.emailLabel}>Undang lewat email</Text>
                      <Text style={styles.emailText}>{query}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.emailInviteBtn}
                      onPress={() => handleInviteEmail(query)}
                      disabled={emailInvites.includes(query) || createInvitation.isPending}
                    >
                      <Check size={16} color={emailInvites.includes(query) ? colors.teal : colors.white} />
                      <Text style={styles.emailInviteBtnText}>
                        {emailInvites.includes(query) ? 'Terkirim' : 'Kirim'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Search size={32} color={colors.muted} />
                    <Text style={styles.emptyTitle}>Tidak ditemukan</Text>
                    <Text style={styles.emptyDesc}>
                      Coba cari dengan nama lengkap atau username yang berbeda.
                    </Text>
                  </>
                )}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <View style={[styles.userAvatar, { backgroundColor: colors.coral }]}>
                <Text style={styles.userAvatarLetter}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userUsername}>@{item.username}</Text>
              </View>
              {isInvitedUser(item.username) ? (
                <View style={styles.invitedBadge}>
                  <Check size={12} color={colors.teal} />
                  <Text style={styles.invitedText}>Terundang</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.inviteBtn}
                  onPress={() => handleInvite(item.username, item.name)}
                  disabled={createInvitation.isPending}
                >
                  <Plus size={14} color={colors.coral} />
                </TouchableOpacity>
              )}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

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

function InvitedList({ emailInvites, onRemoveEmail }: { emailInvites: string[]; onRemoveEmail: (email: string) => void }) {
  return (
    <View>
      {emailInvites.map((email) => (
        <View key={email} style={[styles.userRow, { paddingVertical: 10 }]}>
          <View style={[styles.userAvatar, { backgroundColor: colors.tealLight }]}>
            <Text style={[styles.userAvatarLetter, { color: colors.teal }]}>@</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{email}</Text>
            <Text style={styles.invitedStatus}>Undangan terkirim</Text>
          </View>
          <TouchableOpacity onPress={() => onRemoveEmail(email)}>
            <X size={14} color={colors.muted} />
          </TouchableOpacity>
        </View>
      ))}
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
    maxHeight: '85%',
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
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 24,
  },
  helperText: {
    ...typography.body,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarLetter: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  userUsername: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  invitedStatus: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.teal,
    marginTop: 1,
  },
  invitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  invitedText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.teal,
  },
  inviteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  emailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailInfo: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
  },
  emailInviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.coral,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emailInviteBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
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
