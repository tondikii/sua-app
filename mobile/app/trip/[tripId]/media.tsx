import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDocuments, type TripDocumentItem } from '@/features/media/hooks/useDocuments';
import { useSetCover } from '@/features/media/hooks/useSetCover';
import { useRemoveCover } from '@/features/media/hooks/useRemoveCover';
import { useDeleteDocument } from '@/features/media/hooks/useDeleteDocument';
import { useUploadDocument } from '@/features/media/hooks/useUploadDocument';
import { MediaViewer } from '@/features/media/components/MediaViewer';
import { useToast } from '@/components/Toast';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Trash2 } from '@/components/icons/Trash2';
import { Upload } from '@/components/icons/Upload';
import { Star } from '@/components/icons/Star';
import { Video } from '@/components/icons/Video';
import { MessageCircle } from '@/components/icons/MessageCircle';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { MOBILE_MAX_WIDTH } from '@/theme/layout';

/** Grid layout constants (Figma: 3 columns, gap 8, padding horizontal 20). */
const GRID_COLUMNS = 3;
const GRID_GAP = 8;
const GRID_PADDING_H = 20;

/**
 * Video tile thumbnail. On web, RN <Image> cannot render video files, so we
 * use a real <video preload="metadata" muted> element — the browser paints the
 * first frame as the thumbnail. On native we fall back to the play icon only.
 */
function VideoThumb({ uri }: { uri: string }) {
  if (Platform.OS === 'web') {
    return (
      <video
        src={uri}
        style={styles.videoThumbWeb}
        preload="metadata"
        muted
        playsInline
        disablePictureInPicture
      />
    );
  }
  return (
    <View style={styles.videoFallback}>
      <Video size={28} color={colors.white} />
    </View>
  );
}

function DocumentTile({
  item,
  width,
  onPress,
  onDelete,
}: {
  item: TripDocumentItem;
  width: number;
  onPress: () => void;
  onDelete: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tile, { width }, item.is_cover && styles.tileCover]}
      onPress={onPress}
      onLongPress={onDelete}
      activeOpacity={0.8}
    >
      {item.media_type === 'video' ? (
        <VideoThumb uri={item.url} />
      ) : (
        <Image source={{ uri: item.url }} style={styles.tileImage} resizeMode="cover" />
      )}
      {item.media_type === 'video' && (
        <View style={styles.videoOverlay} pointerEvents="none">
          <Video size={22} color={colors.white} />
        </View>
      )}
      {item.is_cover && (
        <View style={styles.coverBadge}>
          <Star size={9} color={colors.white} fill={colors.white} />
          <Text style={styles.coverBadgeText}>Cover</Text>
        </View>
      )}
      {item.from_chat && !item.is_cover && (
        <View style={styles.chatBadge}>
          <MessageCircle size={9} color={colors.teal} />
          <Text style={styles.chatBadgeText}>Chat</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function MediaTabContent({ tripId }: { tripId: string }) {
  const { width: windowWidth } = useWindowDimensions();
  const { data, isLoading } = useDocuments(tripId);
  const setCover = useSetCover(tripId);
  const removeCover = useRemoveCover(tripId);
  const deleteDoc = useDeleteDocument(tripId);
  const uploadDoc = useUploadDocument(tripId);
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<TripDocumentItem | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null);
  const [removingCover, setRemovingCover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const documents = data?.data ?? [];
  const hasMedia = documents.length > 0;

  // Static tile width so a lone item in the last row stays 1/3-width instead
  // of stretching full-width (FlatList numColumns flex:1 behavior).
  const gridWidth = Math.min(windowWidth, MOBILE_MAX_WIDTH) - GRID_PADDING_H * 2;
  const tileWidth = (gridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  // Grid items: upload tile hard-coded at index 0, then the media docs.
  // Rendering upload as a real grid cell (not a ListHeader) keeps it exactly
  // the same size/shape as media tiles (Figma DocumentGrid).
  const gridItems = useMemo(
    () => [
      { type: 'upload' as const },
      ...documents.map((d) => ({ type: 'doc' as const, doc: d })),
    ],
    [documents],
  );

  const handleUpload = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const mediaType = asset.type === 'video' ? 'video' : 'photo';
    const mimeType = asset.mimeType ?? (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');

    setUploading(true);
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      await uploadDoc.uploadFile(blob, mediaType, mimeType);
    } catch {
      showToast('Tidak dapat mengunggah file');
    } finally {
      setUploading(false);
    }
  }, [uploadDoc, showToast]);

  const handleSetCover = useCallback(
    (docId: string) => {
      setSettingCoverId(docId);
      setCover.mutate(docId, {
        onSettled: () => setSettingCoverId(null),
      });
    },
    [setCover],
  );

  const handleRemoveCover = useCallback(() => {
    setRemovingCover(true);
    removeCover.mutate(undefined, {
      onSettled: () => setRemovingCover(false),
    });
  }, [removeCover]);

  const handleDelete = useCallback((doc: TripDocumentItem) => {
    setDeleteTarget(doc);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteDoc.mutate(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteDoc, deleteTarget]);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { type: 'upload' } | { type: 'doc'; doc: TripDocumentItem };
      index: number;
    }) => {
      if (item.type === 'upload') {
        return (
          <TouchableOpacity
            style={[styles.uploadTile, { width: tileWidth }]}
            activeOpacity={0.7}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.coral} />
            ) : (
              <Upload size={20} color={colors.muted} />
            )}
            <Text style={styles.uploadLabel}>{uploading ? 'Mengunggah...' : 'Unggah'}</Text>
          </TouchableOpacity>
        );
      }
      const doc = item.doc;
      // Viewer index = index dalam documents (tanpa tile upload).
      const docIndex = index - 1;
      return (
        <DocumentTile
          item={doc}
          width={tileWidth}
          onPress={() => setViewerIndex(docIndex)}
          onDelete={() => handleDelete(doc)}
        />
      );
    },
    [handleUpload, uploading, handleDelete, tileWidth],
  );

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
        </View>
      ) : (
        <FlatList
          data={gridItems}
          renderItem={renderItem}
          keyExtractor={(item) => (item.type === 'upload' ? 'upload-tile' : item.doc.id)}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
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

      {/* Media viewer */}
      <MediaViewer
        visible={viewerIndex !== null}
        documents={documents}
        initialIndex={viewerIndex ?? 0}
        onClose={() => setViewerIndex(null)}
        onSetCover={handleSetCover}
        onRemoveCover={handleRemoveCover}
        removingCover={removingCover}
        onDelete={(docId) => {
          const doc = documents.find((d) => d.id === docId);
          if (doc) handleDelete(doc);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  infoSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  infoTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  infoDesc: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.muted,
    marginTop: 4,
    lineHeight: 15,
  },
  gridContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  gridRow: { gap: 8, marginBottom: 8 },
  tile: {
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tileCover: { borderWidth: 2, borderColor: colors.coral },
  tileImage: { width: '100%', height: '100%' },
  videoThumbWeb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: colors.light,
  } as any,
  videoFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.coral,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  coverBadgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  chatBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chatBadgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  // Upload tile = sel grid pertama, ukuran sama persis dengan tile media.
  uploadTile: {
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: colors.light,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
    marginTop: 6,
  },
  emptyContainer: { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText: { ...typography.body, color: colors.muted },
});
