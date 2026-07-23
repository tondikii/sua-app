import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import type { UserSummary } from '@atur-perjalanan/shared-types';

const SEARCH_HISTORY_KEY = 'ap_search_history';
const MAX_HISTORY = 10;

function SearchUserRow({
  user,
  onPress,
  variant,
}: {
  user: UserSummary;
  onPress: () => void;
  variant: 'recent' | 'result';
}) {
  return (
    <TouchableOpacity style={styles.userRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.userAvatar}>
        {user.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.userAvatarImg} />
        ) : (
          <View style={[styles.userAvatarFallback, { backgroundColor: avatarColorFor(user.username) }]}>
            <Text style={styles.userAvatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
      </View>
      {variant === 'result' && (
        <Text style={styles.userChevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [history, setHistory] = useState<UserSummary[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data, isLoading } = useUserSearch(debouncedQuery);
  const results = data?.data ?? [];

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 350);
  }, []);

  const handlePressUser = useCallback((user: UserSummary) => {
    // Add to history
    setHistory((prev) => {
      const filtered = prev.filter((u) => u.id !== user.id);
      return [user, ...filtered].slice(0, MAX_HISTORY);
    });
    router.push(`/profile/${user.username}`);
  }, [router]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const showIdle = !debouncedQuery.trim();
  const showResults = debouncedQuery.trim().length >= 2;

  return (
    <View style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <View style={[styles.searchBar, query.length > 0 && styles.searchBarFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau username..."
            placeholderTextColor={colors.mutedLight}
            value={query}
            onChangeText={handleQueryChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Idle state — recent searches */}
      {showIdle && (
        <View style={styles.idleContainer}>
          {history.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🕐</Text>
                <Text style={styles.sectionLabel}>PENCARIAN TERAKHIR</Text>
              </View>
              {history.map((user) => (
                <SearchUserRow
                  key={user.id}
                  user={user}
                  variant="recent"
                  onPress={() => handlePressUser(user)}
                />
              ))}
            </>
          )}
          <Text style={styles.helperText}>
            Temukan teman untuk diajak merencanakan liburan bareng.
          </Text>
        </View>
      )}

      {/* Results */}
      {showResults && (
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.coral} />
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak ada hasil</Text>
            <Text style={styles.emptyDesc}>
              Coba cari dengan nama lengkap atau username yang berbeda. Pastikan ejaannya benar.
            </Text>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultCount}>{results.length} hasil ditemukan</Text>
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <SearchUserRow
                  user={item}
                  variant="result"
                  onPress={() => handlePressUser(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  searchBarContainer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchBarFocused: { borderColor: colors.coral, shadowColor: colors.coralLight, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal },
  clearBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { fontSize: 14, color: colors.muted, fontWeight: '700' },
  idleContainer: { flex: 1, paddingHorizontal: 22, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionIcon: { fontSize: 14 },
  sectionLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, letterSpacing: 0.5 },
  helperText: { ...typography.body, color: colors.mutedLight, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginBottom: 8 },
  emptyDesc: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  resultsContainer: { flex: 1, paddingHorizontal: 22 },
  resultCount: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginBottom: 12 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 15, overflow: 'hidden' },
  userAvatarImg: { width: '100%', height: '100%', borderRadius: 15 },
  userAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  userAvatarLetter: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  userUsername: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  userChevron: { fontSize: 22, color: colors.mutedLight },
});
