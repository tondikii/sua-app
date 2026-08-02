import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X } from '@/components/icons/X';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { Star } from '@/components/icons/Star';
import { Play } from '@/components/icons/Play';
import { Pause } from '@/components/icons/Pause';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import type { TripDocumentItem } from '../hooks/useDocuments';

interface Props {
  visible: boolean;
  documents: TripDocumentItem[];
  initialIndex?: number;
  onClose: () => void;
  onSetCover?: (documentId: string) => void;
  onRemoveCover?: () => void;
  removingCover?: boolean;
  onDelete?: (documentId: string) => void;
}

function formatDuration(totalSeconds: number | null): string {
  if (totalSeconds == null) return '0:00';
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Full-screen media viewer (Figma Screen 121-123).
 * - Photos: contain-fit image with prev/next nav.
 * - Videos: real <video> element on web (RN <Image> can't play video);
 *   custom play/pause + progress scrubber matching the design.
 */
export function MediaViewer({
  visible,
  documents,
  initialIndex = 0,
  onClose,
  onSetCover,
  onRemoveCover,
  removingCover,
  onDelete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Reset to the tapped item every time the viewer opens. Without this, the
  // component stays mounted and `useState(initialIndex)` keeps the last index,
  // so tapping any tile always opens the same (first) media.
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setPlaying(false);
      setProgress(0);
    }
  }, [visible, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setPlaying(false);
    setProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(documents.length - 1, prev + 1));
    setPlaying(false);
    setProgress(0);
  }, [documents.length]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v) setProgress(v.currentTime);
  }, []);

  if (!visible || documents.length === 0) return null;

  const doc = documents[currentIndex];
  const isVideo = doc.media_type === 'video';
  const duration = doc.media_duration_seconds ?? 0;
  const progressPct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
  const meta = doc.from_chat ? 'Diunggah lewat chat' : '';

  return (
    <View style={styles.container}>
      {/* Header (Figma MediaViewerChrome) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={onClose} activeOpacity={0.7}>
          <X size={18} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.counter}>
          {currentIndex + 1} / {documents.length}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Media area with prev/next nav */}
      <View style={styles.mediaWrap}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.navBtn, styles.navPrev]}
            onPress={handlePrev}
            activeOpacity={0.7}
          >
            <ChevronLeft size={18} color={colors.white} />
          </TouchableOpacity>
        )}

        {isVideo && Platform.OS === 'web' ? (
          <View style={styles.videoWrap}>
            <video
              ref={videoRef}
              src={doc.url}
              style={styles.videoWeb}
              playsInline
              preload="metadata"
              onTimeUpdate={onTimeUpdate}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              onEnded={() => setPlaying(false)}
            />
            {/* Big play button when paused (Figma Screen 122) */}
            {!playing && (
              <TouchableOpacity style={styles.bigPlayBtn} onPress={togglePlay} activeOpacity={0.9}>
                <Play size={24} color={colors.charcoal} />
              </TouchableOpacity>
            )}
            {/* Control bar (Figma Screen 123) */}
            <View style={styles.controlBar}>
              <TouchableOpacity
                style={styles.controlPlayBtn}
                onPress={togglePlay}
                activeOpacity={0.7}
              >
                {playing ? (
                  <Pause size={13} color={colors.white} />
                ) : (
                  <Play size={13} color={colors.white} />
                )}
              </TouchableOpacity>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {formatDuration(progress)} / {formatDuration(duration)}
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Image source={{ uri: doc.url }} style={styles.media} resizeMode="contain" />
            {isVideo && (
              <>
                <TouchableOpacity style={styles.bigPlayBtn} onPress={() => {}} activeOpacity={0.9}>
                  <Play size={24} color={colors.charcoal} />
                </TouchableOpacity>
                {doc.media_duration_seconds != null && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationBadgeText}>
                      {formatDuration(doc.media_duration_seconds)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}

        {currentIndex < documents.length - 1 && (
          <TouchableOpacity
            style={[styles.navBtn, styles.navNext]}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <ChevronRight size={18} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Footer (Figma MediaViewerChrome) */}
      <View style={styles.footer}>
        <View>
          {doc.is_cover ? (
            <View style={styles.coverBadge}>
              <Star size={11} color={colors.white} fill={colors.white} />
              <Text style={styles.coverBadgeText}>Cover trip</Text>
            </View>
          ) : onSetCover ? (
            <TouchableOpacity
              style={styles.setCoverBtn}
              onPress={() => onSetCover(doc.id)}
              activeOpacity={0.7}
            >
              <Star size={12} color={colors.white} />
              <Text style={styles.setCoverBtnText}>Jadikan Cover</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.footerRight}>
          {doc.is_cover && onRemoveCover && (
            <TouchableOpacity
              style={styles.removeCoverBtn}
              onPress={onRemoveCover}
              disabled={removingCover}
              activeOpacity={0.7}
            >
              {removingCover ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.removeCoverBtnText}>Lepas Cover</Text>
              )}
            </TouchableOpacity>
          )}
          {!doc.from_chat && onDelete && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(doc.id)}
              activeOpacity={0.7}
            >
              <Trash2 size={13} color={colors.white} />
              <Text style={styles.deleteBtnText}>Hapus</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.footerMeta}>{meta}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    backgroundColor: '#0D0D12',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  counter: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: 'rgba(255,255,255,0.85)',
  },
  mediaWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    minHeight: 0,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  navPrev: {
    left: 8,
  },
  navNext: {
    right: 8,
  },
  // Video (web)
  videoWrap: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWeb: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#000',
  } as any,
  bigPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -28,
    marginTop: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 8,
    zIndex: 4,
  },
  controlBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 5,
  },
  controlPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.75)',
    flexShrink: 0,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerMeta: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.55)',
  },
  removeCoverBtn: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeCoverBtnText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,80,80,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.35)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteBtnText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.coral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  coverBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  setCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  setCoverBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});
