import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDocuments, type TripDocumentItem } from '@/features/media/hooks/useDocuments';
import { useSetCover } from '@/features/media/hooks/useSetCover';
import { useDeleteDocument } from '@/features/media/hooks/useDeleteDocument';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Upload } from '@/components/icons/Upload';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

function DocumentTile({
  item,
  onPress,
  onSetCover,
  onDelete,
}: {
  item: TripDocumentItem;
  onPress: () => void;
  onSetCover: () => void;
  onDelete: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} onLongPress={onDelete} activeOpacity={0.8}>
      <Image source={{ uri: item.url }} style={styles.tileImage} resizeMode="cover" />
      {item.media_type === 'video' && (
        <View style={styles.videoOverlay}>
          <Text style={{ fontSize: 22 }}>▶</Text>
        </View>
      )}
      {item.is_cover && (
        <View style={styles.coverBadge}>
          <Text style={styles.coverBadgeText}>★ Cover</Text>
        </View>
      )}
      {item.from_chat && !item.is_cover && (
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>💬 Chat</Text>
        </View>
      )}
      {!item.is_cover && (
        <TouchableOpacity style={styles.setCoverBtn} onPress={onSetCover}>
          <Text style={styles.setCoverBtnText}>Jadikan Cover</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function MediaScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useDocuments(tripId);
  const setCover = useSetCover(tripId);
  const deleteDoc = useDeleteDocument(tripId);

  const documents = data?.data ?? [];

  const handleSetCover = useCallback((docId: string) => {
    setCover.mutate(docId);
  }, [setCover]);

  const handleDelete = useCallback((docId: string) => {
    Alert.alert('Hapus Media?', 'File akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteDoc.mutate(docId) },
    ]);
  }, [deleteDoc]);

  const renderItem = useCallback(({ item }: { item: TripDocumentItem }) => (
    <DocumentTile
      item={item}
      onPress={() => {}}
      onSetCover={() => handleSetCover(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  ), [handleSetCover, handleDelete]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Media Perjalanan</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Media Perjalanan</Text>
        <Text style={styles.infoDesc}>
          {documents.length > 0
            ? `${documents.length} file · termasuk yang dikirim lewat chat grup`
            : 'Unggah foto atau kirim lewat chat untuk mengisi tab ini.'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          ListHeaderComponent={
            <TouchableOpacity style={styles.uploadTile} activeOpacity={0.7}>
              <Upload size={20} color={colors.muted} />
              <Text style={styles.uploadLabel}>Unggah</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada media</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginHorizontal: 10 },
  headerTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  infoSection: { padding: 16, paddingBottom: 8 },
  infoTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  infoDesc: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted, marginTop: 4 },
  gridContent: { padding: 16, paddingBottom: 40 },
  gridRow: { gap: 8, marginBottom: 8 },
  tile: { flex: 1, aspectRatio: 1, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.light },
  tileImage: { width: '100%', height: '100%' },
  videoOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  coverBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: colors.coral, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  coverBadgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  chatBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 },
  chatBadgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  setCoverBtn: { position: 'absolute', bottom: 6, left: 6, right: 6, height: 26, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  setCoverBtnText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  uploadTile: { flex: 1, aspectRatio: 1, borderRadius: 14, backgroundColor: colors.light, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  uploadLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, marginTop: 6 },
  emptyContainer: { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText: { ...typography.body, color: colors.muted },
});
