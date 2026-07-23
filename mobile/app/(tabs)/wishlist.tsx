import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlists } from '@/features/wishlist/hooks/useWishlists';
import { useWishlistTags } from '@/features/wishlist/hooks/useWishlistTags';
import { useCreateWishlist } from '@/features/wishlist/hooks/useCreateWishlist';
import { useDeleteWishlist } from '@/features/wishlist/hooks/useDeleteWishlist';
import { useConvertToTrip } from '@/features/wishlist/hooks/useConvertToTrip';
import { Plus } from '@/components/icons/Plus';
import { MapPin } from '@/components/icons/MapPin';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import type { WishlistItem, PriorityLevel } from '@atur-perjalanan/shared-types';

const PRIORITY_META: Record<PriorityLevel, { label: string; color: string; bg: string }> = {
  high: { label: 'Tinggi', color: colors.coral, bg: colors.coralLight },
  medium: { label: 'Menengah', color: colors.amber, bg: colors.amberLight },
  low: { label: 'Rendah', color: colors.teal, bg: colors.tealLight },
};

const SORT_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'high', label: 'Tinggi' },
  { id: 'medium', label: 'Menengah' },
  { id: 'low', label: 'Rendah' },
] as const;

function WishlistGridCard({
  item,
  onPress,
  onDelete,
  onConvert,
}: {
  item: WishlistItem;
  onPress: () => void;
  onDelete: () => void;
  onConvert: () => void;
}) {
  const pMeta = PRIORITY_META[item.priority_level] ?? PRIORITY_META.medium;

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.8}>
      {/* Cover */}
      <View style={styles.gridCardCover}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.gridCardImage} resizeMode="cover" />
        ) : (
          <View style={styles.gridCardPlaceholder}>
            <MapPin size={24} color={colors.mutedLight} />
          </View>
        )}
        <View style={[styles.priorityBadge, { backgroundColor: pMeta.bg }]}>
          <Text style={[styles.priorityBadgeText, { color: pMeta.color }]}>{pMeta.label}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.gridCardBody}>
        <Text style={styles.gridCardTitle} numberOfLines={1}>{item.place_name}</Text>
        {item.location_label && (
          <View style={styles.gridCardLocation}>
            <MapPin size={11} color={colors.muted} />
            <Text style={styles.gridCardLocationText} numberOfLines={1}>{item.location_label}</Text>
          </View>
        )}
        {item.tags.length > 0 && (
          <View style={styles.gridCardTags}>
            {item.tags.slice(0, 2).map((tag, i) => (
              <View key={i} style={styles.gridCardTagChip}>
                <Text style={styles.gridCardTagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.gridCardActions}>
        <TouchableOpacity style={styles.gridCardAction} onPress={onConvert}>
          <Text style={styles.gridCardActionText}>Jadikan Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridCardActionDelete} onPress={onDelete}>
          <Trash2 size={14} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function WishlistScreen() {
  const router = useRouter();
  const [sortTab, setSortTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const priority = sortTab === 'all' ? undefined : sortTab;
  const { data, isLoading } = useWishlists(priority);
  const { data: tagsData } = useWishlistTags();
  const deleteWishlist = useDeleteWishlist();

  const items = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter((item) =>
      item.place_name.toLowerCase().includes(q) ||
      item.location_label?.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const handleDelete = useCallback((item: WishlistItem) => {
    Alert.alert('Hapus dari Wishlist?', `${item.place_name} akan dihapus.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteWishlist.mutate(item.id) },
    ]);
  }, [deleteWishlist]);

  const handleConvert = useCallback((item: WishlistItem) => {
    // Navigate to create trip with prefilled name
    router.push(`/trip/create?wishlistId=${item.id}&name=${encodeURIComponent(item.place_name)}`);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: WishlistItem }) => (
    <WishlistGridCard
      item={item}
      onPress={() => {}}
      onDelete={() => handleDelete(item)}
      onConvert={() => handleConvert(item)}
    />
  ), [handleDelete, handleConvert]);

  const tags = tagsData?.data ?? [];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist Aktivitas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Plus size={18} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari aktivitas wishlist..."
          placeholderTextColor={colors.mutedLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sort tabs */}
      <View style={styles.sortTabs}>
        {SORT_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.sortTab, sortTab === tab.id && styles.sortTabActive]}
            onPress={() => setSortTab(tab.id)}
          >
            <Text style={[styles.sortTabText, sortTab === tab.id && styles.sortTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tag chips */}
      {tags.length > 0 && (
        <View style={styles.tagChips}>
          <View style={[styles.tagChip, styles.tagChipActive]}>
            <Text style={[styles.tagChipText, styles.tagChipTextActive]}>Semua</Text>
          </View>
          {tags.slice(0, 5).map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagChipText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
            </View>
          ))}
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Wishlist masih kosong</Text>
          <Text style={styles.emptyDesc}>Tambahkan aktivitas impianmu!</Text>
          <TouchableOpacity style={styles.emptyCta} onPress={() => setShowForm(true)}>
            <Plus size={16} color={colors.white} />
            <Text style={styles.emptyCtaText}>Tambah Aktivitas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CreateWishlistSheet visible={showForm} onClose={() => setShowForm(false)} />
    </View>
  );
}

function CreateWishlistSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const createWishlist = useCreateWishlist();
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!placeName.trim()) {
      Alert.alert('Validasi', 'Nama aktivitas wajib diisi');
      return;
    }
    try {
      await createWishlist.mutateAsync({
        place_name: placeName.trim(),
        location_label: location.trim() || undefined,
        priority_level: priority,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
      });
      setPlaceName('');
      setLocation('');
      setPriority('medium');
      setStartTime('');
      setEndTime('');
      onClose();
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan');
    }
  }, [placeName, location, priority, startTime, endTime, createWishlist, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Tambah Wishlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <Text style={{ fontSize: 18, color: colors.muted }}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sheetBody}>
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Nama Aktivitas *</Text>
              <TextInput
                style={styles.sheetInput}
                placeholder="Contoh: Pantai Tanjung Aan"
                placeholderTextColor={colors.mutedLight}
                value={placeName}
                onChangeText={setPlaceName}
              />
            </View>

            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Prioritas</Text>
              <View style={styles.priorityRow}>
                {(['high', 'medium', 'low'] as const).map((p) => {
                  const m = PRIORITY_META[p];
                  const active = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.priorityChip, active && { backgroundColor: m.bg, borderColor: m.color }]}
                      onPress={() => setPriority(p)}
                    >
                      <Text style={[styles.priorityChipText, active && { color: m.color }]}>{m.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Lokasi</Text>
              <TextInput
                style={styles.sheetInput}
                placeholder="Nama tempat atau alamat"
                placeholderTextColor={colors.mutedLight}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.timeRow}>
              <View style={[styles.sheetField, { flex: 1 }]}>
                <Text style={styles.sheetLabel}>Mulai</Text>
                <TextInput style={styles.sheetInput} placeholder="09:00" placeholderTextColor={colors.mutedLight} value={startTime} onChangeText={setStartTime} />
              </View>
              <View style={[styles.sheetField, { flex: 1 }]}>
                <Text style={styles.sheetLabel}>Selesai</Text>
                <TextInput style={styles.sheetInput} placeholder="12:00" placeholderTextColor={colors.mutedLight} value={endTime} onChangeText={setEndTime} />
              </View>
            </View>
          </View>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[styles.sheetSubmitBtn, createWishlist.isPending && { backgroundColor: colors.disabled }]}
              onPress={handleSubmit}
              disabled={createWishlist.isPending}
            >
              <Text style={styles.sheetSubmitText}>
                {createWishlist.isPending ? 'Menyimpan...' : 'Simpan Aktivitas'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.5 },
  addBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  searchContainer: { paddingHorizontal: 22, marginBottom: 8 },
  searchInput: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1, borderColor: colors.border },
  sortTabs: { flexDirection: 'row', paddingHorizontal: 22, gap: 8, marginBottom: 8 },
  sortTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.light },
  sortTabActive: { backgroundColor: colors.coralLight },
  sortTabText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted },
  sortTabTextActive: { color: colors.coral },
  tagChips: { flexDirection: 'row', paddingHorizontal: 22, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tagChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: colors.light },
  tagChipActive: { backgroundColor: colors.coralLight },
  tagChipText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  tagChipTextActive: { color: colors.coral },
  gridContent: { paddingHorizontal: 22, paddingBottom: 112 },
  gridRow: { gap: 12, marginBottom: 12 },
  gridCard: { flex: 1, backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  gridCardCover: { height: 118, backgroundColor: colors.light, overflow: 'hidden' },
  gridCardImage: { width: '100%', height: '100%' },
  gridCardPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  priorityBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityBadgeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  gridCardBody: { padding: 10, paddingBottom: 6 },
  gridCardTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  gridCardLocation: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  gridCardLocationText: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, flex: 1 },
  gridCardTags: { flexDirection: 'row', gap: 4, marginTop: 6 },
  gridCardTagChip: { backgroundColor: colors.tealLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  gridCardTagText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  gridCardActions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, gap: 6 },
  gridCardAction: { flex: 1, height: 28, borderRadius: 8, backgroundColor: colors.coralLight, alignItems: 'center', justifyContent: 'center' },
  gridCardActionText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  gridCardActionDelete: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.dangerLight, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginBottom: 8 },
  emptyDesc: { ...typography.body, color: colors.muted, marginBottom: 20 },
  emptyCta: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 24, borderRadius: 14, backgroundColor: colors.coral },
  emptyCtaText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(26,26,46,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  sheetTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  sheetCloseBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  sheetBody: { padding: 20, paddingTop: 8, gap: 14 },
  sheetField: { gap: 6 },
  sheetLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  sheetInput: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityChip: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.light, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  priorityChipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted },
  timeRow: { flexDirection: 'row', gap: 12 },
  sheetFooter: { padding: 20, paddingTop: 8 },
  sheetSubmitBtn: { height: 50, borderRadius: 14, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  sheetSubmitText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
});
