import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useDeleteMessage } from '@/features/chat/hooks/useDeleteMessage';
import { useMarkChatRead } from '@/features/chat/hooks/useMarkChatRead';
import { useAuth } from '@/auth/AuthProvider';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Paperclip } from '@/components/icons/Paperclip';
import { Send } from '@/components/icons/Send';
import { Reply } from '@/components/icons/Reply';
import { Copy } from '@/components/icons/Copy';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import { avatarColorFor } from '@/theme/colors';
import { formatNotificationTime } from '@/features/trips/components/TripDateUtils';
import type { TripMessage } from '@atur-perjalanan/shared-types';

function ChatBubble({
  message,
  isMe,
  isHighlighted,
  onLongPress,
}: {
  message: TripMessage;
  isMe: boolean;
  isHighlighted: boolean;
  onLongPress: () => void;
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

      <View style={styles.bubbleContent}>
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
          <Image source={{ uri: message.media_url }} style={styles.mediaImage} resizeMode="cover" />
        )}

        {/* Text */}
        {message.message_text && (
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
            {message.message_text}
          </Text>
        )}

        <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther]}>
          {timeText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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

export default function ChatScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(tripId);
  const sendMessage = useSendMessage(tripId);
  const deleteMessage = useDeleteMessage(tripId);
  const markChatRead = useMarkChatRead(tripId);
  const flatListRef = useRef<FlatList>(null);

  const [inputText, setInputText] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<TripMessage | null>(null);

  const messages = useMemo(() => {
    const pages = data?.pages ?? [];
    // API returns most recent first, reverse for display
    return pages.flatMap((p) => p.data).reverse();
  }, [data]);

  // Mark chat as read on mount
  useEffect(() => {
    markChatRead.mutate();
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');
    setReplyTo(null);

    try {
      await sendMessage.mutateAsync({
        message_kind: 'text',
        message_text: text,
        reply_to_id: replyTo?.id,
      });
    } catch {
      Alert.alert('Gagal', 'Tidak dapat mengirim pesan');
    }
  }, [inputText, replyTo, sendMessage]);

  const handleDelete = useCallback((messageId: string) => {
    setHighlightedId(null);
    Alert.alert('Hapus Pesan?', 'Pesan akan dihapus.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteMessage.mutate(messageId) },
    ]);
  }, [deleteMessage]);

  const renderMessage = useCallback(({ item }: { item: TripMessage }) => {
    const isMe = item.sender?.id === user?.id;
    return (
      <ChatBubble
        message={item}
        isMe={isMe}
        isHighlighted={highlightedId === item.id}
        onLongPress={() => setHighlightedId(item.id)}
      />
    );
  }, [user, highlightedId]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>Chat</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Belum ada obrolan</Text>
          <Text style={styles.emptyDesc}>Mulai percakapan dengan anggota trip.</Text>
        </View>
      ) : (
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
      )}

      {/* Reply preview */}
      {replyTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewName}>{replyTo.sender?.name ?? 'Pesan'}</Text>
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {replyTo.message_text ?? 'Media'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
        <TextInput
          style={styles.inputField}
          placeholder="Tulis pesan..."
          placeholderTextColor={colors.mutedLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sendMessage.isPending}
        >
          <Send size={17} color={inputText.trim() ? colors.white : colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Long press menu */}
      {highlightedId && (
        <LongPressMenu
          isMe={messages.find((m) => m.id === highlightedId)?.sender?.id === user?.id}
          onReply={() => {
            const msg = messages.find((m) => m.id === highlightedId);
            if (msg) setReplyTo(msg);
            setHighlightedId(null);
          }}
          onCopy={() => {
            const msg = messages.find((m) => m.id === highlightedId);
            if (msg?.message_text) {
              // Clipboard.setString(msg.message_text);
            }
            setHighlightedId(null);
          }}
          onDelete={() => handleDelete(highlightedId)}
          onClose={() => setHighlightedId(null)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginHorizontal: 10 },
  headerTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  messagesContent: { padding: 16, paddingBottom: 8, gap: 6 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 19, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  // Bubbles
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowOther: { justifyContent: 'flex-start' },
  bubbleHighlighted: { backgroundColor: 'rgba(26,26,46,0.05)', borderRadius: 12 },
  bubbleContent: { maxWidth: '72%' },
  avatarSmall: { width: 30, height: 30, borderRadius: 15, marginRight: 8, overflow: 'hidden' },
  avatarSmallImg: { width: '100%', height: '100%', borderRadius: 15 },
  avatarSmallFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  avatarSmallLetter: { fontSize: 11, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  avatarSpacer: { width: 30, marginRight: 8 },
  senderName: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginBottom: 3 },
  bubbleText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', lineHeight: 19 },
  bubbleTextMe: { color: colors.white },
  bubbleTextOther: { color: colors.charcoal },
  bubbleTime: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4 },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  bubbleTimeOther: { color: colors.mutedLight },
  // Bubble styles (applied via inline to distinguish me/other)
  deletedBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  deletedBubbleMe: { backgroundColor: colors.light, borderBottomRightRadius: 4 },
  deletedBubbleOther: { backgroundColor: colors.light, borderBottomLeftRadius: 4 },
  deletedText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted, fontStyle: 'italic' },
  // Media
  mediaImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 4 },
  // Reply
  replyQuote: { borderLeftWidth: 3, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 6 },
  replyQuoteMe: { borderLeftColor: 'rgba(255,255,255,0.65)', backgroundColor: 'rgba(0,0,0,0.14)' },
  replyQuoteOther: { borderLeftColor: colors.coral, backgroundColor: colors.light },
  replyLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  replyText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted },
  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white, gap: 8 },
  inputField: { flex: 1, backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1, borderColor: colors.border, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', shadowColor: colors.coral, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.31, shadowRadius: 18, elevation: 4 },
  sendBtnDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  // Reply preview
  replyPreview: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.light, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 },
  replyPreviewContent: { flex: 1 },
  replyPreviewName: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  replyPreviewText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted },
  // Long press
  longPressBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,15,20,0.38)', zIndex: 10, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 16 },
  longPressMenu: { backgroundColor: colors.white, borderRadius: 18, width: 196, paddingVertical: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.22, shadowRadius: 60, elevation: 20 },
  longPressItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 13 },
  longPressItemText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  longPressDivider: { height: 1, backgroundColor: colors.border },
});
