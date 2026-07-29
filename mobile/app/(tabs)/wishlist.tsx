import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWishlists } from '@/features/wishlist/hooks/useWishlists';
import { useWishlistTags } from '@/features/wishlist/hooks/useWishlistTags';
import { useCreateWishlist } from '@/features/wishlist/hooks/useCreateWishlist';
import { useUpdateWishlist } from '@/features/wishlist/hooks/useUpdateWishlist';
import { useDeleteWishlist } from '@/features/wishlist/hooks/useDeleteWishlist';
import { useConvertToTrip } from '@/features/wishlist/hooks/useConvertToTrip';
import { Plus } from '@/components/icons/Plus';
import { X } from '@/components/icons/X';
import { MapPin } from '@/components/icons/MapPin';
import { Trash2 } from '@/components/icons/Trash2';
import { MoreHorizontal } from '@/components/icons/MoreHorizontal';
import { Pencil } from '@/components/icons/Pencil';
import { Search } from '@/components/icons/Search';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
import type { WishlistItem, PriorityLevel } from '@atur-perjalanan/shared-types';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

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

// ─── Empty State Illustration ─────────────────────────────────────────────────

function WishlistEmptyIllustration() {
  return (
    <Svg width={180} height={156} viewBox="0 0 180 156" fill="none">
      <Circle cx={90} cy={78} r={70} fill={colors.coralLight} />
      <Circle cx={90} cy={78} r={50} fill="white" stroke="#E0F5F4" strokeWidth={2} />
      <Path d="M90 50 C82 38, 60 38, 60 54 C60 72, 90 88, 90 88 C90 88, 120 72, 120 54 C120 38, 98 38, 90 50Z" fill={colors.coral} opacity={0.8} />
      <Circle cx={80} cy={56} r={3} fill="white" opacity={0.4} />
      <G transform="translate(85, 100) rotate(-15)">
        <Circle cx={0} cy={0} r={8} fill="none" stroke={colors.teal} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
        <Path d="M0 -14 L3 -4 L0 0 L-3 -4Z" fill={colors.teal} opacity={0.7} />
        <Path d="M0 14 L-3 4 L0 0 L3 4Z" fill={colors.teal} opacity={0.4} />
      </G>
      <Circle cx={38} cy={50} r={3} fill="#FFB347" opacity={0.6} />
      <Circle cx={148} cy={44} r={2.5} fill={colors.teal} opacity={0.5} />
      <Circle cx={152} cy={108} r={2} fill={colors.coral} opacity={0.4} />
      <Circle cx={32} cy={110} r={2} fill={colors.teal} opacity={0.5} />
    </Svg>
  );
}

// ─── WishlistGridCard ─────────────────────────────────────────────────────────

function WishlistGridCard({
  item,
  onPress,
  onOpenMenu,
}: {
  item: WishlistItem;
  onPress: () => void;
  onOpenMenu: () => void;
}) {
  const pMeta = PRIORITY_META[item.priority_level] ?? PRIORITY_META.medium;

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.gridCardCover}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.gridCardImage} resizeMode="cover" />
        ) : (
          <View style={styles.gridCardPlaceholder}>
            <MapPin size={24} color={colors.mutedLight} />
          </View>
        )}
        <View style={[styles.priorityBadge, { backgroundColor: pMeta.bg, borderColor: pMeta.color + '25' }]}>
          <Text style={[styles.priorityBadgeText, { color: pMeta.color }]}>{pMeta.label}</Text>
        </View>
        <TouchableOpacity style={styles.navIcon} activeOpacity={0.7}>
          <ChevronRight size={13} color={colors.teal} />
        </TouchableOpacity>
      </View>
      <View style={styles.gridCardBody}>
        <Text style={styles.gridCardTitle} numberOfLines={1}>{item.place_name}</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu} activeOpacity={0.7}>
          <MoreHorizontal size={15} color={colors.muted} />
        </TouchableOpacity>
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
    </TouchableOpacity>
  );
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function WishlistContextMenu({
  visible,
  onClose,
  onEdit,
  onDelete,
  onConvert,
  item,
}: {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConvert: () => void;
  item: WishlistItem | null;
}) {
  if (!visible || !item) return null;

  return (
    <View style={styles.contextMenu}>
      <TouchableOpacity style={styles.contextMenuItem} onPress={onConvert} activeOpacity={0.7}>
        <ChevronRight size={15} color={colors.teal} />
        <Text style={[styles.contextMenuText, { color: colors.teal }]}>Jadikan Perjalanan</Text>
      </TouchableOpacity>
      <View style={styles.contextMenuDivider} />
      <TouchableOpacity style={styles.contextMenuItem} onPress={onEdit} activeOpacity={0.7}>
        <Pencil size={15} color={colors.charcoal} />
        <Text style={styles.contextMenuText}>Edit</Text>
      </TouchableOpacity>
      <View style={styles.contextMenuDivider} />
      <TouchableOpacity style={styles.contextMenuItem} onPress={onDelete} activeOpacity={0.7}>
        <Trash2 size={15} color={colors.danger} />
        <Text style={[styles.contextMenuText, { color: colors.danger }]}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ visible, onClose, onConfirm, item }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: WishlistItem | null;
}) {
  if (!visible || !item) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.deleteBackdrop}>
        <View style={styles.deleteModal}>
          <TouchableOpacity style={styles.deleteCloseBtn} onPress={onClose}>
            <X size={13} color={colors.muted} />
          </TouchableOpacity>
          <View style={styles.deleteIconContainer}>
            <Trash2 size={22} color={colors.danger} />
          </View>
          <Text style={styles.deleteTitle}>Hapus dari wishlist?</Text>
          <Text style={styles.deleteDesc}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal }}>{item.place_name}</Text>
            {' akan dihapus dari daftar wishlistmu.'}
          </Text>
          <View style={styles.deleteActions}>
            <TouchableOpacity style={styles.deleteCancelBtn} onPress={onClose}>
              <Text style={styles.deleteCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={onConfirm}>
              <Text style={styles.deleteConfirmText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function DetailSheet({ visible, onClose, item, onConvert }: {
  visible: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  onConvert: () => void;
}) {
  if (!visible || !item) return null;
  const pMeta = PRIORITY_META[item.priority_level] ?? PRIORITY_META.medium;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{item.place_name}</Text>
              {item.location_label && <Text style={styles.sheetSubtitle}>{item.location_label}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
            {item.thumbnail_url && (
              <View style={styles.detailImageContainer}>
                <Image source={{ uri: item.thumbnail_url }} style={styles.detailImage} resizeMode="cover" />
                <View style={styles.detailImageOverlay} />
                <View style={[styles.detailPriorityBadge, { backgroundColor: pMeta.bg }]}>
                  <Text style={[styles.detailPriorityText, { color: pMeta.color }]}>Prioritas {pMeta.label}</Text>
                </View>
              </View>
            )}

            {item.tags.length > 0 && (
              <View style={styles.detailTags}>
                {item.tags.map((tag, i) => (
                  <View key={i} style={styles.gridCardTagChip}>
                    <Text style={styles.gridCardTagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
                  </View>
                ))}
              </View>
            )}

            {item.location_label && (
              <View style={styles.detailLocation}>
                <MapPin size={13} color={colors.muted} />
                <Text style={styles.detailLocationText}>{item.location_label}</Text>
              </View>
            )}

            {item.notes && <Text style={styles.detailNotes}>{item.notes}</Text>}

            {item.link && (
              <View>
                <Text style={styles.detailTautanLabel}>TAUTAN</Text>
                <TouchableOpacity style={styles.detailLinkRow}>
                  <ChevronRight size={15} color={colors.teal} />
                  <Text style={styles.detailLinkText} numberOfLines={1}>{item.link}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.sheetPrimaryBtn} onPress={onConvert} activeOpacity={0.8}>
              <Text style={styles.sheetPrimaryBtnText}>Jadikan Perjalanan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── TimePicker component ────────────────────────────────────────────────────

function TimePicker({ value, onChange, onClose }: { value: string; onChange: (t: string) => void; onClose: () => void }) {
  const [h, m] = value ? value.split(':') : ['09', '00'];
  const [selHour, setSelHour] = useState(h);
  const [selMin, setSelMin] = useState(m);

  return (
    <View style={styles.timePickerContainer}>
      <View style={styles.timePickerColumns}>
        <View style={styles.timePickerCol}>
          <Text style={styles.timePickerColLabel}>Jam</Text>
          <ScrollView style={styles.timePickerList} showsVerticalScrollIndicator={false}>
            {HOURS.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[styles.timePickerItem, selHour === hour && styles.timePickerItemActive]}
                onPress={() => setSelHour(hour)}
              >
                <Text style={[styles.timePickerItemText, selHour === hour && styles.timePickerItemTextActive]}>{hour}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.timePickerCol}>
          <Text style={styles.timePickerColLabel}>Menit</Text>
          <ScrollView style={styles.timePickerList} showsVerticalScrollIndicator={false}>
            {MINUTES.map((min) => (
              <TouchableOpacity
                key={min}
                style={[styles.timePickerItem, selMin === min && styles.timePickerItemActive]}
                onPress={() => setSelMin(min)}
              >
                <Text style={[styles.timePickerItemText, selMin === min && styles.timePickerItemTextActive]}>{min}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.timePickerActions}>
        <TouchableOpacity onPress={onClose} style={styles.timePickerCancel}>
          <Text style={styles.timePickerCancelText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChange(`${selHour}:${selMin}`)} style={styles.timePickerConfirm}>
          <Text style={styles.timePickerConfirmText}>Pilih</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Create / Edit Sheet ──────────────────────────────────────────────────────

function WishlistFormSheet({ visible, onClose, editItem }: {
  visible: boolean;
  onClose: () => void;
  editItem?: WishlistItem | null;
}) {
  const createWishlist = useCreateWishlist();
  const editMutation = useUpdateWishlist(editItem?.id ?? '');
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (editItem) {
      setPlaceName(editItem.place_name);
      setLocation(editItem.location_label ?? '');
      setPriority(editItem.priority_level);
      setStartTime(editItem.start_time ?? '');
      setEndTime(editItem.end_time ?? '');
      setNotes(editItem.notes ?? '');
      setLink(editItem.link ?? '');
      setTags(editItem.tags ?? []);
      setTagsInput('');
      setTitleError('');
    } else {
      setPlaceName('');
      setLocation('');
      setPriority('medium');
      setStartTime('');
      setEndTime('');
      setNotes('');
      setLink('');
      setTags([]);
      setTagsInput('');
      setTitleError('');
    }
  }, [editItem, visible]);

  const mutation = editItem ? editMutation : createWishlist;

  const handleSubmit = useCallback(async () => {
    if (!placeName.trim()) {
      setTitleError('Nama aktivitas wajib diisi');
      return;
    }
    setTitleError('');
    try {
      const payload = {
        place_name: placeName.trim(),
        location_label: location.trim() || undefined,
        priority_level: priority,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        notes: notes.trim() || undefined,
        link: link.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      if (editItem) {
        await (mutation as ReturnType<typeof useUpdateWishlist>).mutateAsync(payload);
      } else {
        await (mutation as ReturnType<typeof useCreateWishlist>).mutateAsync(payload);
      }
      onClose();
    } catch {
      setTitleError('Terjadi kesalahan');
    }
  }, [placeName, location, priority, startTime, endTime, notes, link, tags, editItem, mutation, onClose]);

  const addTag = useCallback(() => {
    const trimmed = tagsInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed.startsWith('#') ? trimmed : `#${trimmed}`]);
      setTagsInput('');
    }
  }, [tagsInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{editItem ? 'Edit Wishlist' : 'Tambah ke Wishlist'}</Text>
              <Text style={styles.sheetSubtitle}>{editItem ? (editItem.location_label ?? editItem.place_name) : 'Simpan aktivitas impianmu'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
            {/* Mulai / Selesai */}
            <View style={styles.timeRow}>
              <View style={[styles.sheetField, { flex: 1 }]}>
                <Text style={styles.sheetLabel}>Mulai</Text>
                <TouchableOpacity style={styles.timeInputBox} onPress={() => { setShowStartPicker(true); setShowEndPicker(false); }} activeOpacity={0.7}>
                  <Text style={[styles.timeValue, !startTime && { color: colors.mutedLight, fontFamily: 'PlusJakartaSans_400Regular' }]}>{startTime || '09:00'}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.sheetField, { flex: 1 }]}>
                <Text style={styles.sheetLabel}>Selesai</Text>
                <TouchableOpacity style={styles.timeInputBox} onPress={() => { setShowEndPicker(true); setShowStartPicker(false); }} activeOpacity={0.7}>
                  <Text style={[styles.timeValue, !endTime && { color: colors.mutedLight, fontFamily: 'PlusJakartaSans_400Regular' }]}>{endTime || '16:00'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showStartPicker && (
              <TimePicker value={startTime || '09:00'} onChange={(t) => { setStartTime(t); setShowStartPicker(false); }} onClose={() => setShowStartPicker(false)} />
            )}
            {showEndPicker && (
              <TimePicker value={endTime || '16:00'} onChange={(t) => { setEndTime(t); setShowEndPicker(false); }} onClose={() => setShowEndPicker(false)} />
            )}

            {/* Nama Aktivitas */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Nama Aktivitas <Text style={{ color: colors.coral }}>*</Text></Text>
              <TextInput
                style={[styles.sheetInput, titleError ? styles.sheetInputError : undefined]}
                placeholder="Contoh: Pantai Tanjung Aan"
                placeholderTextColor={colors.mutedLight}
                value={placeName}
                onChangeText={(t) => { setPlaceName(t); if (titleError) setTitleError(''); }}
              />
              {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
            </View>

            {/* Prioritas */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Prioritas</Text>
              <View style={styles.priorityRow}>
                {(['high', 'medium', 'low'] as const).map((p) => {
                  const m = PRIORITY_META[p];
                  const active = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.priorityChip, active && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 2 }]}
                      onPress={() => setPriority(p)}
                    >
                      <Text style={[styles.priorityChipText, active && { color: m.color, fontFamily: 'PlusJakartaSans_700Bold' }]}>{m.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Lokasi */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Lokasi</Text>
              <TextInput style={styles.sheetInput} placeholder="Nama tempat atau alamat" placeholderTextColor={colors.mutedLight} value={location} onChangeText={setLocation} />
            </View>

            {/* Notes */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Catatan</Text>
              <TextInput
                style={[styles.sheetInput, { minHeight: 60 }]}
                placeholder="Tambahkan catatan..."
                placeholderTextColor={colors.mutedLight}
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Link */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Link Referensi</Text>
              <TextInput style={styles.sheetInput} placeholder="https://..." placeholderTextColor={colors.mutedLight} value={link} onChangeText={setLink} />
            </View>

            {/* Tags */}
            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Tags</Text>
              <View style={styles.tagsInputContainer}>
                {tags.map((tag) => (
                  <TouchableOpacity key={tag} style={styles.tagChipItem} onPress={() => removeTag(tag)}>
                    <Text style={styles.tagChipItemText}>{tag}</Text>
                    <X size={10} color={colors.teal} />
                  </TouchableOpacity>
                ))}
                <TextInput
                  style={styles.tagInputField}
                  placeholder="+ Tambah tag..."
                  placeholderTextColor={colors.mutedLight}
                  value={tagsInput}
                  onChangeText={setTagsInput}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[styles.sheetSubmitBtn, mutation.isPending && { backgroundColor: colors.disabled }]}
              onPress={handleSubmit}
              disabled={mutation.isPending}
            >
              <Text style={styles.sheetSubmitText}>
                {mutation.isPending ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Simpan Aktivitas'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WishlistScreen() {
  const router = useRouter();
  const [sortTab, setSortTab] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [menuTarget, setMenuTarget] = useState<WishlistItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WishlistItem | null>(null);
  const [detailItem, setDetailItem] = useState<WishlistItem | null>(null);

  const priority = sortTab === 'all' ? undefined : sortTab;
  const tag = activeTag || undefined;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useWishlists(priority, tag);
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

  const tags = tagsData?.data ?? [];

  const handleDelete = useCallback((item: WishlistItem) => {
    setMenuTarget(null);
    setDeleteTarget(item);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteWishlist.mutate(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteWishlist]);

  const handleEdit = useCallback((item: WishlistItem) => {
    setMenuTarget(null);
    setEditingItem(item);
  }, []);

  const handleConvert = useCallback((item: WishlistItem) => {
    setMenuTarget(null);
    setDetailItem(null);
    router.push(`/trip/create?wishlistId=${item.id}&name=${encodeURIComponent(item.place_name)}`);
  }, [router]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: { item: WishlistItem }) => (
    <WishlistGridCard
      item={item}
      onPress={() => setDetailItem(item)}
      onOpenMenu={() => setMenuTarget(item)}
    />
  ), []);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist Aktivitas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchQuery.length > 0 && styles.searchBarFocused]}>
          <Search size={16} color={searchQuery.length > 0 ? colors.coral : colors.muted} />
          <TextInput
            style={[styles.searchInput, webOutlineNone]}
            placeholder="Cari aktivitas wishlist..."
            placeholderTextColor={colors.mutedLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <X size={11} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort tabs */}
      <View style={styles.sortTabs}>
        {SORT_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.sortTab, sortTab === tab.id && styles.sortTabActive]}
            onPress={() => setSortTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortTabText, sortTab === tab.id && styles.sortTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tag chips */}
      {tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagChipsContainer}>
          <TouchableOpacity
            style={[styles.tagChip, activeTag === null && styles.tagChipActive]}
            onPress={() => setActiveTag(null)}
          >
            <Text style={[styles.tagChipText, activeTag === null && styles.tagChipTextActive]}>Semua</Text>
          </TouchableOpacity>
          {tags.slice(0, 6).map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagChip, activeTag === tag && styles.tagChipActive]}
              onPress={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              <Text style={[styles.tagChipText, activeTag === tag && styles.tagChipTextActive]}>
                {tag.startsWith('#') ? tag : `#${tag}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <WishlistEmptyIllustration />
          <Text style={styles.emptyTitle}>Wishlist masih kosong</Text>
          <Text style={styles.emptyDesc}>Simpan aktivitas impianmu di sini — nanti bisa dijadikan perjalanan dengan satu tap.</Text>
          <TouchableOpacity style={styles.emptyCta} onPress={() => setShowForm(true)} activeOpacity={0.8}>
            <Plus size={18} color={colors.white} />
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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Context Menu Overlay */}
      {menuTarget && (
        <>
          <TouchableOpacity style={styles.contextOverlay} activeOpacity={1} onPress={() => setMenuTarget(null)} />
          <WishlistContextMenu
            visible
            onClose={() => setMenuTarget(null)}
            onEdit={() => handleEdit(menuTarget)}
            onDelete={() => handleDelete(menuTarget)}
            onConvert={() => handleConvert(menuTarget)}
            item={menuTarget}
          />
        </>
      )}

      {/* Sheets */}
      <DetailSheet visible={!!detailItem} onClose={() => setDetailItem(null)} item={detailItem} onConvert={() => detailItem && handleConvert(detailItem)} />
      <WishlistFormSheet visible={showForm} onClose={() => setShowForm(false)} />
      <WishlistFormSheet visible={!!editingItem} onClose={() => setEditingItem(null)} editItem={editingItem} />
      <DeleteModal visible={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} item={deleteTarget} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.5 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  // Search
  searchContainer: { paddingHorizontal: 22, paddingBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 1.5, borderColor: colors.border },
  searchBarFocused: { borderColor: colors.coral, shadowColor: colors.coral, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal },
  clearBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  // Sort tabs
  sortTabs: { flexDirection: 'row', paddingHorizontal: 22, gap: 8, marginBottom: 12, borderBottomWidth: 1.5, borderBottomColor: colors.border, paddingBottom: 10 },
  sortTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.light },
  sortTabActive: { backgroundColor: colors.coralLight },
  sortTabText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  sortTabTextActive: { fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  // Tag chips
  tagChipsContainer: { paddingHorizontal: 22, gap: 8, marginBottom: 12 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.light, borderWidth: 1, borderColor: colors.border },
  tagChipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  tagChipText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  tagChipTextActive: { color: colors.white },
  // Grid
  gridContent: { paddingHorizontal: 22, paddingBottom: 112 },
  gridRow: { gap: 14, marginBottom: 14 },
  gridCard: { flex: 1, backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', ...shadows.card },
  gridCardCover: { height: 118, backgroundColor: colors.light, overflow: 'hidden' },
  gridCardImage: { width: '100%', height: '100%' },
  gridCardPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  priorityBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  priorityBadgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold' },
  navIcon: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  gridCardBody: { padding: 11, paddingHorizontal: 12, paddingBottom: 13 },
  gridCardTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.2, lineHeight: 16.9, marginBottom: 4 },
  menuBtn: { position: 'absolute', top: 11, right: 12, width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  gridCardLocation: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  gridCardLocationText: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, flex: 1 },
  gridCardTags: { flexDirection: 'row', gap: 4, marginTop: 6 },
  gridCardTagChip: { backgroundColor: colors.tealLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  gridCardTagText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  // Context menu
  contextOverlay: { ...StyleSheet.absoluteFill as any, zIndex: 30 },
  contextMenu: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -86 }, { translateY: -80 }], width: 172, backgroundColor: colors.white, borderRadius: 12, paddingVertical: 4, ...shadows.menu, zIndex: 40 },
  contextMenuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, paddingHorizontal: 14 },
  contextMenuText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  contextMenuDivider: { height: 1, backgroundColor: colors.border },
  // Empty state
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 80 },
  emptyTitle: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginTop: 18, marginBottom: 10, textAlign: 'center' },
  emptyDesc: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, textAlign: 'center', lineHeight: 21.7, maxWidth: 280, marginBottom: 28 },
  emptyCta: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 52, paddingHorizontal: 28, borderRadius: 16, backgroundColor: colors.coral, ...shadows.button },
  emptyCtaText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Delete modal
  deleteBackdrop: { flex: 1, backgroundColor: 'rgba(26,26,46,0.45)', alignItems: 'center', justifyContent: 'center' },
  deleteModal: { width: '85%', maxWidth: 300, backgroundColor: colors.white, borderRadius: 20, padding: 22, paddingHorizontal: 20, alignItems: 'center', ...shadows.modal },
  deleteCloseBtn: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 8, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  deleteIconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.dangerLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  deleteTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.2, marginBottom: 6 },
  deleteDesc: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, lineHeight: 18.6, textAlign: 'center', marginBottom: 18 },
  deleteActions: { flexDirection: 'row', gap: 10, width: '100%' },
  deleteCancelBtn: { flex: 1, height: 44, borderRadius: 12, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  deleteCancelText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  deleteConfirmBtn: { flex: 1, height: 44, borderRadius: 12, backgroundColor: colors.danger, borderWidth: 1.5, borderColor: colors.dangerDark, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  deleteConfirmText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  // Detail sheet
  detailImageContainer: { height: 148, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  detailImage: { width: '100%', height: '100%' },
  detailImageOverlay: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(26,26,46,0.35)' },
  detailPriorityBadge: { position: 'absolute', bottom: 10, left: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  detailPriorityText: { fontSize: 11, fontFamily: 'PlusJakartaSans_800ExtraBold' },
  detailTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  detailLocation: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  detailLocationText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  detailNotes: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: colors.charcoal, lineHeight: 20.15, marginBottom: 12 },
  detailTautanLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 },
  detailLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 4 },
  detailLinkText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.teal, flex: 1 },
  // Sheet shared
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(26,26,46,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: '85%' },
  sheetHandle: { width: 40, height: 5, borderRadius: 20, backgroundColor: colors.border, alignSelf: 'center', marginTop: 14, marginBottom: 6 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  sheetSubtitle: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginTop: 2 },
  sheetCloseBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  sheetBody: { padding: 16, paddingBottom: 40, gap: 14 },
  sheetField: { gap: 6 },
  sheetLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  sheetInput: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border, ...webOutlineNone },
  sheetInputError: { borderColor: colors.danger, borderWidth: 2, backgroundColor: colors.dangerLight },
  timeInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: colors.border },
  timeValue: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  // TimePicker
  timePickerContainer: { marginTop: 8, padding: 12, paddingHorizontal: 10, backgroundColor: colors.white, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, ...shadows.card },
  timePickerColumns: { flexDirection: 'row', gap: 8 },
  timePickerCol: { flex: 1, alignItems: 'center' },
  timePickerColLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, marginBottom: 6 },
  timePickerList: { maxHeight: 140, borderRadius: 10, backgroundColor: colors.light },
  timePickerItem: { paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center' },
  timePickerItemActive: { backgroundColor: colors.coralLight },
  timePickerItemText: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium', color: colors.charcoal },
  timePickerItemTextActive: { fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.coral },
  timePickerActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
  timePickerCancel: { paddingVertical: 6, paddingHorizontal: 12 },
  timePickerCancelText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted },
  timePickerConfirm: { backgroundColor: colors.coral, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 16 },
  timePickerConfirmText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
  errorText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.danger },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityChip: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.light, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  priorityChipText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted },
  timeRow: { flexDirection: 'row', gap: 12 },
  tagsInputContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', backgroundColor: colors.light, borderRadius: 14, padding: 12, paddingHorizontal: 14, borderWidth: 1.5, borderColor: colors.border, minHeight: 44 },
  tagChipItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.tealLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tagChipItemText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  tagInputField: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, minWidth: 80, paddingVertical: 2, ...webOutlineNone },
  // Footer
  sheetFooter: { padding: 16, paddingHorizontal: 22, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.border },
  sheetSubmitBtn: { height: 50, borderRadius: 14, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  sheetSubmitText: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  sheetPrimaryBtn: { height: 50, borderRadius: 14, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  sheetPrimaryBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
});
