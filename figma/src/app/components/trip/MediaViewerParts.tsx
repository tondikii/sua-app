import type { ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Star, ImagePlus, Share2 } from 'lucide-react';
import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING } from './CreateTripParts';
import { BottomNav } from '../BottomNav';
import { TripDetailHeader, TripDetailTabs, TRIP_COUNTS_DATE_PENDING } from './TripDetailParts';
import { DocumentGrid, SAMPLE_DOCUMENTS, type TripDocument } from './DocumentParts';

export const DEMO_MEDIA_PHOTO: TripDocument & {
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
} = {
  ...SAMPLE_DOCUMENTS[0],
  caption: 'Sunset di Pantai Gili',
  uploadedBy: 'Rina',
  uploadedAt: '12 Jun 2026',
};

export const DEMO_MEDIA_VIDEO: TripDocument & {
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  duration?: string;
  progress?: string;
} = {
  ...SAMPLE_DOCUMENTS[2],
  caption: 'Drone view Bromo pagi',
  uploadedBy: 'Budi',
  uploadedAt: '13 Jun 2026',
  duration: '2:15',
  progress: '0:42',
};

/** Backdrop tab Media — konteks sebelum viewer dibuka */
export function MediaTabBackdrop() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: C.white,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: FONT,
            overflow: 'hidden',
          }}
        >
          <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_DATE_PENDING} />
          <TripDetailTabs activeTab="media" counts={TRIP_COUNTS_DATE_PENDING} />
          <div style={{ flex: 1, padding: '16px 20px', overflow: 'hidden' }}>
            <DocumentGrid showSetCover />
          </div>
          <BottomNav active="home" />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(13,13,18,0.72)',
          zIndex: 10,
        }}
      />
    </>
  );
}

type MediaViewerChromeProps = {
  children: ReactNode;
  currentIndex: number;
  totalCount: number;
  caption?: string;
  meta?: string;
  showSetCover?: boolean;
  isCover?: boolean;
};

function MediaViewerChrome({
  children,
  currentIndex,
  totalCount,
  caption,
  meta,
  showSetCover = false,
  isCover = false,
}: MediaViewerChromeProps) {
  const hasPrev = currentIndex > 1;
  const hasNext = currentIndex < totalCount;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        backgroundColor: '#0D0D12',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          paddingTop: 52,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} color="white" strokeWidth={2.5} />
        </button>

        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
          {currentIndex} / {totalCount}
        </span>

        <button
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Share2 size={16} color="white" strokeWidth={2.5} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
        }}
      >
        {hasPrev && (
          <button
            type="button"
            style={{
              position: 'absolute',
              left: 8,
              zIndex: 2,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} color="white" strokeWidth={2.5} />
          </button>
        )}

        <div
          style={{
            width: '100%',
            maxHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>

        {hasNext && (
          <button
            type="button"
            style={{
              position: 'absolute',
              right: 8,
              zIndex: 2,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={18} color="white" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div
        style={{
          padding: '12px 20px 28px',
          flexShrink: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
        }}
      >
        {caption && (
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'white',
              margin: '0 0 4px',
              lineHeight: 1.4,
            }}
          >
            {caption}
          </p>
        )}
        {meta && (
          <p
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 12px',
              fontWeight: 500,
            }}
          >
            {meta}
          </p>
        )}

        {isCover ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              backgroundColor: C.coral,
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 10,
            }}
          >
            <Star size={11} fill="white" strokeWidth={0} />
            Cover trip
          </div>
        ) : showSetCover ? (
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: '9px 14px',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            <ImagePlus size={14} strokeWidth={2.5} />
            Jadikan Cover
          </button>
        ) : null}
      </div>
    </div>
  );
}

type MediaPhotoViewerProps = {
  document?: TripDocument & { caption?: string; uploadedBy?: string; uploadedAt?: string };
  currentIndex?: number;
  totalCount?: number;
  showSetCover?: boolean;
};

/** Viewer foto — fullscreen, swipe antar media */
export function MediaPhotoViewer({
  document = DEMO_MEDIA_PHOTO,
  currentIndex = 1,
  totalCount = 3,
  showSetCover = true,
}: MediaPhotoViewerProps) {
  const meta =
    document.uploadedBy && document.uploadedAt
      ? `Diunggah ${document.uploadedBy} · ${document.uploadedAt}`
      : undefined;

  return (
    <MediaViewerChrome
      currentIndex={currentIndex}
      totalCount={totalCount}
      caption={document.caption}
      meta={meta}
      showSetCover={showSetCover && !document.isCover}
      isCover={document.isCover}
    >
      <img
        src={document.url.replace('w=400', 'w=900').replace('h=280', 'h=1200')}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: 4,
          display: 'block',
        }}
      />
    </MediaViewerChrome>
  );
}

type MediaVideoViewerProps = {
  document?: TripDocument & {
    caption?: string;
    uploadedBy?: string;
    uploadedAt?: string;
    duration?: string;
    progress?: string;
  };
  currentIndex?: number;
  totalCount?: number;
  playing?: boolean;
};

/** Viewer video — kontrol play & progress */
export function MediaVideoViewer({
  document = DEMO_MEDIA_VIDEO,
  currentIndex = 3,
  totalCount = 3,
  playing = false,
}: MediaVideoViewerProps) {
  const meta =
    document.uploadedBy && document.uploadedAt
      ? `Diunggah ${document.uploadedBy} · ${document.uploadedAt}`
      : undefined;
  const progressPct = 32;

  return (
    <MediaViewerChrome
      currentIndex={currentIndex}
      totalCount={totalCount}
      caption={document.caption}
      meta={meta}
    >
      <div style={{ position: 'relative', width: '100%', maxHeight: '100%' }}>
        <img
          src={document.url}
          alt=""
          style={{
            width: '100%',
            maxHeight: '58vh',
            objectFit: 'contain',
            display: 'block',
            borderRadius: 4,
          }}
        />

        {!playing && (
          <button
            type="button"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          >
            <Play size={24} color={C.charcoal} strokeWidth={2.5} style={{ marginLeft: 3 }} />
          </button>
        )}

        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            padding: '10px 12px',
            borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {playing ? (
                <Pause size={13} color="white" strokeWidth={2.5} />
              ) : (
                <Play size={13} color="white" strokeWidth={2.5} style={{ marginLeft: 1 }} />
              )}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    backgroundColor: C.coral,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.75)',
                flexShrink: 0,
              }}
            >
              {document.progress ?? '0:00'} / {document.duration ?? '0:00'}
            </span>
          </div>
        </div>
      </div>
    </MediaViewerChrome>
  );
}
