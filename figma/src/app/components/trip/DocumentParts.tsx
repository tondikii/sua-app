import { ImagePlus, Video, Star, Upload, MessageCircle } from 'lucide-react';
import { C, FONT } from '../colors';
import { TRIP_IMAGES } from '../tripImages';

export type TripDocument = {
  id: number;
  type: 'photo' | 'video';
  url: string;
  isCover?: boolean;
  /** Diunggah lewat chat grup */
  fromChat?: boolean;
};

export const SAMPLE_DOCUMENTS: TripDocument[] = [
  { id: 1, type: 'photo', url: TRIP_IMAGES.giliBeach, isCover: true },
  { id: 2, type: 'photo', url: TRIP_IMAGES.lombok },
  { id: 3, type: 'video', url: TRIP_IMAGES.bromo },
];

/** Media termasuk unggahan dari chat */
export const SAMPLE_DOCUMENTS_WITH_CHAT: TripDocument[] = [
  ...SAMPLE_DOCUMENTS,
  { id: 4, type: 'photo', url: TRIP_IMAGES.giliBeach, fromChat: true },
  { id: 5, type: 'video', url: TRIP_IMAGES.bromo, fromChat: true },
];

type DocumentGridProps = {
  documents?: TripDocument[];
  showSetCover?: boolean;
};

export function DocumentGrid({ documents = SAMPLE_DOCUMENTS, showSetCover = false }: DocumentGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      <button
        type="button"
        style={{
          aspectRatio: '1',
          backgroundColor: C.light,
          border: `2px dashed ${C.border}`,
          borderRadius: 14,
          cursor: 'pointer',
          fontFamily: FONT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Upload size={20} color={C.muted} strokeWidth={2} />
        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>Unggah</span>
      </button>

      {documents.map((doc) => (
        <div
          key={doc.id}
          role="button"
          tabIndex={0}
          style={{
            aspectRatio: '1',
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: doc.isCover ? `0 0 0 2px ${C.coral}` : `0 2px 8px ${C.shadow}`,
            cursor: 'pointer',
          }}
        >
          <img src={doc.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {doc.type === 'video' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
              }}
            >
              <Video size={22} color="white" strokeWidth={2} />
            </div>
          )}
          {doc.isCover && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                backgroundColor: C.coral,
                color: 'white',
                fontSize: 9,
                fontWeight: 800,
                padding: '3px 7px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Star size={9} fill="white" strokeWidth={0} />
              Cover
            </div>
          )}
          {doc.fromChat && !doc.isCover && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                backgroundColor: 'rgba(255,255,255,0.94)',
                fontSize: 9,
                fontWeight: 700,
                color: C.teal,
                padding: '3px 7px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <MessageCircle size={9} strokeWidth={2.5} />
              Chat
            </div>
          )}
          {showSetCover && !doc.isCover && (
            <button
              type="button"
              style={{
                position: 'absolute',
                bottom: 6,
                left: 6,
                right: 6,
                height: 26,
                backgroundColor: 'rgba(255,255,255,0.94)',
                border: 'none',
                borderRadius: 8,
                fontSize: 9,
                fontWeight: 700,
                color: C.charcoal,
                cursor: 'pointer',
                fontFamily: FONT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <ImagePlus size={10} strokeWidth={2.5} />
              Jadikan Cover
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
