import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { Search } from '@/components/icons/Search';
import { X } from '@/components/icons/X';
import { Clock } from '@/components/icons/Clock';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import type { UserSummary } from '@atur-perjalanan/shared-types';

const SEARCH_HISTORY_KEY = 'ap_search_history';
const MAX_HISTORY = 10;

type SearchUserWithTrips = UserSummary & { trip_count?: number };

function SearchUserRow({
  user,
  onPress,
  variant,
}: {
  user: SearchUserWithTrips;
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
        {variant === 'result' && user.trip_count != null && (
          <Text style={styles.userTripCount}>{user.trip_count} perjalanan</Text>
        )}
      </View>
      {variant === 'result' && (
        <ChevronRight size={18} color={colors.mutedLight} />
      )}
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [history, setHistory] = useState<SearchUserWithTrips[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data, isLoading } = useUserSearch(debouncedQuery);
  const results = data?.data ?? [];

  // Hydrate search history from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(SEARCH_HISTORY_KEY).then((raw) => {
      if (raw) {
        try {
          setHistory(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const persistHistory = useCallback((updated: SearchUserWithTrips[]) => {
    setHistory(updated);
    AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated)).catch(() => {});
  }, []);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 350);
  }, []);

  const handlePressUser = useCallback((user: SearchUserWithTrips) => {
    const filtered = history.filter((u) => u.id !== user.id);
    persistHistory([user, ...filtered].slice(0, MAX_HISTORY));
    router.push(`/profile/${user.username}`);
  }, [router, history, persistHistory]);

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
        <View style={[styles.searchBar, (searchFocused || query.length > 0) && styles.searchBarFocused]}>
          <Search size={16} color={query.length > 0 ? colors.coral : colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau username..."
            placeholderTextColor={colors.mutedLight}
            value={query}
            onChangeText={handleQueryChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <X size={11} color={colors.white} />
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
                <Clock size={14} color={colors.muted} />
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
            <View style={styles.emptyIconContainer}>
              <Search size={32} color={colors.muted} />
            </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 10,
  },
  searchBarFocused: { borderColor: colors.coral, shadowColor: colors.coral, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) },
  clearBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  idleContainer: { flex: 1, paddingHorizontal: 22, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, letterSpacing: 0.5 },
  helperText: { ...typography.body, color: colors.mutedLight, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconContainer: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginBottom: 8, letterSpacing: -0.3 },
  emptyDesc: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  resultsContainer: { flex: 1, paddingHorizontal: 22 },
  resultCount: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginBottom: 12 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 15, overflow: 'hidden' },
  userAvatarImg: { width: '100%', height: '100%', borderRadius: 15 },
  userAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  userAvatarLetter: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.2 },
  userUsername: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  userTripCount: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.mutedLight, marginTop: 2 },
});
