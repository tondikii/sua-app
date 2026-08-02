import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useDeleteMessage } from '@/features/chat/hooks/useDeleteMessage';
import { useMarkChatRead } from '@/features/chat/hooks/useMarkChatRead';
import { useUploadDocument } from '@/features/media/hooks/useUploadDocument';
import { useTripChatSubscription } from '@/realtime/useTripChatSubscription';
import { ChatAttachMenu } from '@/features/chat/components/ChatAttachMenu';
import { ChatMediaComposer } from '@/features/chat/components/ChatMediaComposer';
import { MediaViewer } from '@/features/media/components/MediaViewer';
import { ConfirmModal } from '@/components/ConfirmModal';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { Paperclip } from '@/components/icons/Paperclip';
import { Send } from '@/components/icons/Send';
import { Reply } from '@/components/icons/Reply';
import { Copy } from '@/components/icons/Copy';
import { Trash2 } from '@/components/icons/Trash2';
import { X } from '@/components/icons/X';
import { Play } from '@/components/icons/Play';
import { colors, avatarColorFor } from '@/theme/colors';
import { formatNotificationTime } from '@/features/trips/components/TripDateUtils';
import type { TripMessage } from '@atur-perjalanan/shared-types';

function formatDuration(totalSeconds?: number | null): string {
  if (totalSeconds == null) return '0:00';
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Empty chat illustration (SVG-like via Views) ──────────────

function EmptyChatIllustration() {
  return (
    <View style={styles.emptyIllustration}>
      <View style={styles.emptyCircle}>
        {/* Left bubble */}
        <View style={styles.emptyBubbleLeft}>
          <View style={styles.emptyLine1} />
          <View style={styles.emptyLine2} />
        </View>
        {/* Left tail */}
        <View style={styles.emptyTailLeft} />
        {/* Right bubble */}
        <View style={styles.emptyBubbleRight}>
          <View style={styles.emptyLine3} />
          <View style={styles.emptyLine4} />
        </View>
        {/* Right tail */}
        <View style={styles.emptyTailRight} />
      </View>
    </View>
  );
}

// ── Chat bubble ───────────────────────────────────────────────

function ChatBubble({
  message,
  isMe,
  isHighlighted,
  onLongPress,
  onPressMedia,
}: {
  message: TripMessage;
  isMe: boolean;
  isHighlighted: boolean;
  onLongPress: () => void;
  onPressMedia?: () => void;
}) {
  if (message.is_deleted) {
    return (
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
        {!isMe && <View style={styles.avatarSpacer} />}
        <View style={[styles.deletedBubble, isMe ? styles.deletedBubbleMe : styles.deletedBubbleOther]}>
          <Text style={styles.deletedText}>Pesan dihapus</Text>
        </View>
      </View>
    );
  }

  const sender = message.sender;
  const timeText = formatNotificationTime(message.created_at);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={[
        styles.bubbleRow,
        isMe ? styles.bubbleRowMe : styles.bubbleRowOther,
        isHighlighted && styles.bubbleHighlighted,
      ]}
    >
      {!isMe && (
        <View style={styles.avatarSmall}>
          {sender?.avatar_url ? (
            <Image source={{ uri: sender.avatar_url }} style={styles.avatarSmallImg} />
          ) : (
            <View style={[styles.avatarSmallFallback, { backgroundColor: avatarColorFor(sender?.username ?? 'x') }]}>
              <Text style={styles.avatarSmallLetter}>{(sender?.name ?? '?').charAt(0)}</Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.bubbleContent, isMe ? styles.bubbleContentMe : styles.bubbleContentOther]}>
        {!isMe && sender && (
          <Text style={styles.senderName}>{sender.name}</Text>
        )}

        {/* Reply quote */}
        {message.reply_to && (
          <View style={[styles.replyQuote, isMe ? styles.replyQuoteMe : styles.replyQuoteOther]}>
            <Text style={[styles.replyLabel, isMe && { color: 'rgba(255,255,255,0.8)' }]}>
              {message.reply_to.sender?.name ?? 'Pesan'}
            </Text>
            <Text style={[styles.replyText, isMe && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={2}>
              {message.reply_to.message_text ?? 'Media'}
            </Text>
          </View>
        )}

        {/* Media */}
        {message.message_kind !== 'text' && message.media_url && (
          <TouchableOpacity
            style={styles.mediaWrapBubble}
            onPress={onPressMedia}
            activeOpacity={0.85}
            disabled={!onPressMedia}
          >
            {message.message_kind === 'video' && Platform.OS === 'web' ? (
              <video
                src={message.media_url}
                style={styles.mediaVideoWeb}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <>
                <Image source={{ uri: message.media_url }} style={styles.mediaImage} resizeMode="cover" />
                {message.message_kind === 'video' && (
                  <>
                    <View style={styles.mediaVideoOverlay} pointerEvents="none">
                      <View style={styles.mediaPlayCircle}>
                        <Play size={16} color={colors.charcoal} />
                      </View>
                    </View>
                    {message.media_duration_seconds != null && (
                      <View style={styles.mediaDurationBadge}>
                        <Text style={styles.mediaDurationBadgeText}>
                          {formatDuration(message.media_duration_seconds)}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Text */}
        {message.message_text ? (
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
            {message.message_text}
          </Text>
        ) : null}

        <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther]}>
          {timeText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Long press menu ───────────────────────────────────────────

function LongPressMenu({
  isMe,
  onReply,
  onCopy,
  onDelete,
  onClose,
}: {
  isMe: boolean;
  onReply: () => void;
  onCopy: () => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  return (
    <TouchableOpacity style={styles.longPressBackdrop} activeOpacity={1} onPress={onClose}>
      <View style={styles.longPressMenu}>
        <TouchableOpacity style={styles.longPressItem} onPress={onReply}>
          <Reply size={17} color={colors.charcoal} />
          <Text style={styles.longPressItemText}>Balas</Text>
        </TouchableOpacity>
        <View style={styles.longPressDivider} />
        <TouchableOpacity style={styles.longPressItem} onPress={onCopy}>
          <Copy size={17} color={colors.charcoal} />
          <Text style={styles.longPressItemText}>Salin Teks</Text>
        </TouchableOpacity>
        {isMe && onDelete && (
          <>
            <View style={styles.longPressDivider} />
            <TouchableOpacity style={styles.longPressItem} onPress={onDelete}>
              <Trash2 size={17} color={colors.danger} />
              <Text style={[styles.longPressItemText, { color: colors.danger }]}>Hapus</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main component ────────────────────────────────────────────

export function ChatTabContent({ tripId, currentUserId }: { tripId: string; currentUserId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(tripId);
  const sendMessage = useSendMessage(tripId);
  const deleteMessage = useDeleteMessage(tripId);
  const markChatRead = useMarkChatRead(tripId);
  const uploadDoc = useUploadDocument(tripId);
  const flatListRef = useRef<FlatList>(null);

  useTripChatSubscription(tripId);

  const [inputText, setInputText] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<TripMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [composerMedia, setComposerMedia] = useState<{
    uri: string;
    kind: 'photo' | 'video';
    mimeType: string;
    file?: File;
    duration?: number;
  } | null>(null);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [viewerMedia, setViewerMedia] = useState<TripMessage | null>(null);

  // Stable preview URI — on web a `blob:`/`data:` URL from ImagePicker may not
  // render in <Image>; an object URL created from the File always does.
  const composerPreviewUri = useMemo(() => {
    if (!composerMedia) return null;
    if (Platform.OS === 'web' && composerMedia.file) {
      return URL.createObjectURL(composerMedia.file);
    }
    return composerMedia.uri;
  }, [composerMedia]);

  // Revoke the object URL once the composer closes (web only).
  useEffect(() => {
    if (!composerPreviewUri || !composerMedia) return;
    if (Platform.OS !== 'web' || !composerMedia.file) return;
    return () => URL.revokeObjectURL(composerPreviewUri);
  }, [composerPreviewUri, composerMedia]);

  const messages = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.data).reverse();
  }, [data]);

  // Media messages mapped to viewer items (photo/video only, with media_url).
  const chatMediaItems = useMemo(() => {
    return messages
      .filter((m) => m.message_kind !== 'text' && m.media_url)
      .map((m) => ({
        id: m.id,
        trip_id: m.trip_id,
        uploaded_by: m.sender?.id ?? '',
        media_type: m.message_kind as 'photo' | 'video',
        storage_key: '',
        url: m.media_url as string,
        url_expires_in: 3600,
        is_cover: false,
        from_chat: true,
        media_duration_seconds: m.media_duration_seconds ?? null,
        created_at: m.created_at,
      }));
  }, [messages]);

  const viewerInitialIndex = useMemo(() => {
    if (!viewerMedia) return 0;
    return Math.max(0, chatMediaItems.findIndex((i) => i.id === viewerMedia.id));
  }, [viewerMedia, chatMediaItems]);

  useEffect(() => {
    markChatRead.mutate();
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    const replyId = replyTo?.id;
    setInputText('');
    setReplyTo(null);

    try {
      await sendMessage.mutateAsync({
        message_kind: 'text',
        message_text: text,
        reply_to_id: replyId,
      });
    } catch {
      // Silently fail — message stays in input
    }
  }, [inputText, replyTo, sendMessage]);

  const handleDelete = useCallback((messageId: string) => {
    setHighlightedId(null);
    setDeleteTarget(messageId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteMessage.mutate(deleteTarget);
    setDeleteTarget(null);
  }, [deleteMessage, deleteTarget]);

  const handlePickPhoto = useCallback(async () => {
    setAttachMenuOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setComposerMedia({
        uri: asset.uri,
        kind: 'photo',
        mimeType: asset.mimeType ?? 'image/jpeg',
        file: asset.file,
      });
    }
  }, []);

  const handlePickVideo = useCallback(async () => {
    setAttachMenuOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setComposerMedia({
        uri: asset.uri,
        kind: 'video',
        mimeType: asset.mimeType ?? 'video/mp4',
        file: asset.file,
        duration: asset.duration ? Math.round(asset.duration) : undefined,
      });
    }
  }, []);

  const handleSendMedia = useCallback(async (caption: string) => {
    if (!composerMedia) return;
    setSendingMedia(true);
    try {
      // On web the asset exposes a File directly; on native we fetch the
      // file:// URI to get a Blob for the direct-to-R2 upload.
      let blob: Blob;
      if (Platform.OS === 'web' && composerMedia.file) {
        blob = composerMedia.file;
      } else {
        const response = await fetch(composerMedia.uri);
        blob = await response.blob();
      }

      // Upload to R2 (presign + PUT only — backend registers the doc row
      // with `from_chat=true` when the message is created).
      const storageKey = await uploadDoc.uploadChatMedia(
        blob,
        composerMedia.kind,
        composerMedia.mimeType,
      );

      await sendMessage.mutateAsync({
        message_kind: composerMedia.kind,
        media_url: storageKey,
        message_text: caption || undefined,
        media_duration_seconds: composerMedia.duration,
      });
      setComposerMedia(null);
    } catch {
      // Keep composer open on failure
    } finally {
      setSendingMedia(false);
    }
  }, [composerMedia, uploadDoc, sendMessage]);

  const handleCopy = useCallback(() => {
    const msg = messages.find((m) => m.id === highlightedId);
    if (msg?.message_text && Platform.OS === 'web') {
      // On web, use navigator clipboard API
      navigator.clipboard?.writeText(msg.message_text);
    }
    setHighlightedId(null);
  }, [messages, highlightedId]);

  const renderMessage = useCallback(({ item }: { item: TripMessage }) => {
    const isMe = item.sender?.id === currentUserId;
    return (
      <ChatBubble
        message={item}
        isMe={isMe}
        isHighlighted={highlightedId === item.id}
        onLongPress={() => setHighlightedId(item.id)}
        onPressMedia={() => setViewerMedia(item)}
      />
    );
  }, [currentUserId, highlightedId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.coral} />
      </View>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Messages or empty state */}
      {hasMessages ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          inverted={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyChatIllustration />
          <Text style={styles.emptyTitle}>Belum ada obrolan</Text>
          <Text style={styles.emptyDesc}>Sapa teman perjalananmu dan mulai diskusi.</Text>
        </View>
      )}

      {/* Reply preview */}
      {replyTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewName}>
              {replyTo.sender?.id === currentUserId ? 'Kamu' : (replyTo.sender?.name ?? 'Pesan')}
            </Text>
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {replyTo.message_text ?? 'Media'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <View style={styles.inputBarWrap}>
        {attachMenuOpen && (
          <ChatAttachMenu
            onPickPhoto={handlePickPhoto}
            onPickVideo={handlePickVideo}
            onClose={() => setAttachMenuOpen(false)}
          />
        )}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={[styles.attachBtn, attachMenuOpen && styles.attachBtnActive]}
            onPress={() => setAttachMenuOpen((v) => !v)}
            activeOpacity={0.7}
          >
            <Paperclip size={16} color={attachMenuOpen ? colors.coral : colors.muted} />
          </TouchableOpacity>
          <FocusedTextInput
            style={styles.inputField}
            placeholder="Tulis pesan..."
            placeholderTextColor={colors.mutedLight}
            value={inputText}
            onChangeText={setInputText}
            maxLength={1000}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={!inputText.trim() || sendMessage.isPending}
            activeOpacity={0.7}
          >
            {sendMessage.isPending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Send size={17} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Long press menu */}
      {highlightedId && (
        <LongPressMenu
          isMe={messages.find((m) => m.id === highlightedId)?.sender?.id === currentUserId}
          onReply={() => {
            const msg = messages.find((m) => m.id === highlightedId);
            if (msg) setReplyTo(msg);
            setHighlightedId(null);
          }}
          onCopy={handleCopy}
          onDelete={() => handleDelete(highlightedId)}
          onClose={() => setHighlightedId(null)}
        />
      )}

      {/* Delete message confirmation modal */}
      <ConfirmModal
        visible={deleteTarget !== null}
        title="Hapus Pesan?"
        description="Pesan akan dihapus."
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Hapus"
        destructive
        loading={deleteMessage.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Media composer overlay */}
      {composerMedia && composerPreviewUri && (
        <ChatMediaComposer
          visible
          kind={composerMedia.kind}
          mediaUri={composerPreviewUri}
          duration={composerMedia.duration}
          sending={sendingMedia}
          onSend={handleSendMedia}
          onClose={() => setComposerMedia(null)}
        />
      )}

      {/* Fullscreen media viewer for chat media messages */}
      {viewerMedia && (
        <MediaViewer
          visible
          documents={chatMediaItems}
          initialIndex={viewerInitialIndex}
          onClose={() => setViewerMedia(null)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messagesContent: { padding: 16, paddingBottom: 8, gap: 12 },

  // ── Empty state ─────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 20,
  },
  emptyIllustration: { alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyCircle: {
    width: 168,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptyBubbleLeft: {
    position: 'absolute',
    left: 18,
    top: 32,
    width: 74,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  emptyTailLeft: {
    position: 'absolute',
    left: 22,
    top: 78,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.border,
  },
  emptyLine1: { width: 44, height: 7, borderRadius: 3.5, backgroundColor: colors.light },
  emptyLine2: { width: 30, height: 7, borderRadius: 3.5, backgroundColor: colors.light },
  emptyBubbleRight: {
    position: 'absolute',
    right: 18,
    top: 58,
    width: 74,
    height: 46,
    borderRadius: 16,
    backgroundColor: `${colors.coral}18`,
    borderWidth: 1.5,
    borderColor: `${colors.coral}50`,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  emptyTailRight: {
    position: 'absolute',
    right: 22,
    top: 104,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: `${colors.coral}50`,
  },
  emptyLine3: { width: 44, height: 7, borderRadius: 3.5, backgroundColor: `${colors.coral}25` },
  emptyLine4: { width: 32, height: 7, borderRadius: 3.5, backgroundColor: `${colors.coral}20` },
  emptyTitle: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 9,
    letterSpacing: -0.4,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 23,
  },

  // ── Bubbles ─────────────────────────────────────────────────
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowOther: { justifyContent: 'flex-start' },
  bubbleHighlighted: { backgroundColor: 'rgba(26,26,46,0.05)', borderRadius: 12 },
  bubbleContent: { maxWidth: '72%' },
  bubbleContentMe: {
    backgroundColor: colors.coral,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  bubbleContentOther: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarSmall: { width: 30, height: 30, borderRadius: 15, marginRight: 8, overflow: 'hidden' },
  avatarSmallImg: { width: '100%', height: '100%', borderRadius: 15 },
  avatarSmallFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  avatarSmallLetter: { fontSize: 11, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  avatarSpacer: { width: 30, marginRight: 8 },
  senderName: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginBottom: 3 },
  bubbleText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', lineHeight: 19.5 },
  bubbleTextMe: { color: colors.white },
  bubbleTextOther: { color: colors.charcoal },
  bubbleTime: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4 },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  bubbleTimeOther: { color: colors.mutedLight },

  // ── Deleted bubble ──────────────────────────────────────────
  deletedBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  deletedBubbleMe: { backgroundColor: colors.light, borderBottomRightRadius: 4 },
  deletedBubbleOther: { backgroundColor: colors.light, borderBottomLeftRadius: 4 },
  deletedText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted, fontStyle: 'italic' },

  // ── Media ───────────────────────────────────────────────────
  mediaWrapBubble: { position: 'relative', marginBottom: 4, borderRadius: 12, overflow: 'hidden' },
  mediaImage: { width: 200, height: 150, borderRadius: 12 },
  mediaVideoWeb: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#000',
    objectFit: 'cover',
    display: 'block',
  } as any,
  mediaVideoOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  mediaPlayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaDurationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mediaDurationBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },

  // ── Reply quote inside bubble ───────────────────────────────
  replyQuote: { borderLeftWidth: 3, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 6 },
  replyQuoteMe: { borderLeftColor: 'rgba(255,255,255,0.65)', backgroundColor: 'rgba(0,0,0,0.14)' },
  replyQuoteOther: { borderLeftColor: colors.coral, backgroundColor: colors.light },
  replyLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  replyText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted },

  // ── Reply preview above input ───────────────────────────────
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.light,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  replyPreviewContent: { flex: 1 },
  replyPreviewName: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  replyPreviewText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted },

  // ── Input bar (matches Figma ChatInputBar exactly) ──────────
  inputBarWrap: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  attachBtnActive: {
    backgroundColor: colors.coralLight,
    borderWidth: 1.5,
    borderColor: colors.coral,
  },
  inputField: {
    flex: 1,
    backgroundColor: colors.light,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.31,
    shadowRadius: 18,
    elevation: 4,
  },

  // ── Long press menu ─────────────────────────────────────────
  longPressBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,15,20,0.38)',
    zIndex: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  longPressMenu: {
    backgroundColor: colors.white,
    borderRadius: 18,
    width: 196,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.22,
    shadowRadius: 60,
    elevation: 20,
  },
  longPressItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 13 },
  longPressItemText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  longPressDivider: { height: 1, backgroundColor: colors.border },
});
