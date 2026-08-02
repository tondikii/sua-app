import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { X } from '@/components/icons/X';
import { Send } from '@/components/icons/Send';
import { Play } from '@/components/icons/Play';
import { colors } from '@/theme/colors';

interface Props {
  visible: boolean;
  kind: 'photo' | 'video';
  mediaUri: string;
  duration?: number;
  sending?: boolean;
  onSend: (caption: string) => void | Promise<void>;
  onClose: () => void;
}

function formatDuration(totalSeconds?: number): string | null {
  if (totalSeconds == null) return null;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ChatMediaComposer({ visible, kind, mediaUri, duration, sending, onSend, onClose }: Props) {
  const [caption, setCaption] = useState('');

  const handleSend = useCallback(() => {
    void onSend(caption.trim());
  }, [caption, onSend]);

  if (!visible) return null;

  const label = kind === 'photo' ? 'Kirim Foto' : 'Kirim Video';
  const durationLabel = kind === 'video' ? formatDuration(duration) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <X size={18} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>{label}</Text>
      </View>

      {/* Media preview */}
      <View style={styles.mediaWrap}>
        {Platform.OS === 'web' ? (
          // Web: use native <img>/<video> so blob-object URLs always render
          // (react-native-web's <Image> can be flaky with blob: URLs, and it
          // cannot render video files at all).
          kind === 'video' ? (
            <video
              src={mediaUri}
              style={styles.videoPreviewWeb}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={mediaUri} alt="" style={styles.photoPreviewWeb} />
          )
        ) : (
          <>
            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="contain" />
            {kind === 'video' && (
              <>
                <View style={styles.videoOverlay} pointerEvents="none">
                  <View style={styles.playCircle}>
                    <Play size={24} color={colors.charcoal} />
                  </View>
                </View>
                {durationLabel && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationBadgeText}>{durationLabel}</Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>

      {/* Footer: caption + send */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.footer}
      >
        <View style={styles.captionRow}>
          <FocusedTextInput
            style={styles.captionInput}
            placeholder="Tambahkan caption..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={sending}
            activeOpacity={0.7}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Send size={18} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
    backgroundColor: '#0D0D12',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  mediaWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
    minHeight: 0,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoPreviewWeb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#000',
    objectFit: 'contain',
  } as any,
  photoPreviewWeb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    objectFit: 'contain',
    display: 'block',
  } as any,
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: '#16161F',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  captionInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.31,
    shadowRadius: 18,
    elevation: 4,
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
});
