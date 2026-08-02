import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDocuments, type TripDocumentItem } from '@/features/media/hooks/useDocuments';
import { useSetCover } from '@/features/media/hooks/useSetCover';
import { useDeleteDocument } from '@/features/media/hooks/useDeleteDocument';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Trash2 } from '@/components/icons/Trash2';
import { Upload } from '@/components/icons/Upload';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

function DocumentTile({
  item,
  onPress,
  onSetCover,
  onDelete,
  settingCover,
}: {
  item: TripDocumentItem;
  onPress: () => void;
  onSetCover: () => void;
  onDelete: () => void;
  settingCover?: boolean;
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
        <TouchableOpacity style={styles.setCoverBtn} onPress={onSetCover} disabled={settingCover}>
          {settingCover ? (
            <ActivityIndicator size="small" color={colors.charcoal} />
          ) : (
            <Text style={styles.setCoverBtnText}>Jadikan Cover</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export function MediaTabContent({ tripId }: { tripId: string }) {
  const { data, isLoading } = useDocuments(tripId);
  const setCover = useSetCover(tripId);
  const deleteDoc = useDeleteDocument(tripId);
  const [deleteTarget, setDeleteTarget] = useState<TripDocumentItem | null>(null);

  const documents = data?.data ?? [];

  const handleSetCover = useCallback((docId: string) => {
    setCover.mutate(docId);
  }, [setCover]);

  const handleDelete = useCallback((doc: TripDocumentItem) => {
    setDeleteTarget(doc);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteDoc.mutate(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteDoc, deleteTarget]);

  const renderItem = useCallback(({ item }: { item: TripDocumentItem }) => (
    <DocumentTile
      item={item}
      onPress={() => {}}
      onSetCover={() => handleSetCover(item.id)}
      onDelete={() => handleDelete(item)}
      settingCover={setCover.isPending}
    />
  ), [handleSetCover, handleDelete, setCover.isPending]);

  return (
    <View style={styles.screen}>
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

      {/* Delete media confirmation modal */}
      <ConfirmModal
        visible={deleteTarget !== null}
        title="Hapus Media?"
        description="File ini akan dihapus permanen dari perjalanan."
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Hapus"
        destructive
        loading={deleteDoc.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
