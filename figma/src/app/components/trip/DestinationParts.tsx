import { MapPin } from 'lucide-react';
import { C } from '../colors';
import { TRIP_IMAGES } from '../tripImages';

/** Thumbnail default konsisten jika tidak ada preview dari Google Maps */
export const DEFAULT_DESTINATION_THUMB = TRIP_IMAGES.lombok;

type DestinationThumbnailProps = {
  /** URL dari Google Maps Static/Places API — opsional */
  gmapsThumbUrl?: string;
  size?: number;
};

export function DestinationThumbnail({ gmapsThumbUrl, size = 48 }: DestinationThumbnailProps) {
  const src = gmapsThumbUrl ?? DEFAULT_DESTINATION_THUMB;
  const hasGmaps = Boolean(gmapsThumbUrl);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 44 ? 14 : 12,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        backgroundColor: C.light,
      }}
    >
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {hasGmaps && (
        <div
          style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            width: 16,
            height: 16,
            backgroundColor: 'white',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 1px 4px ${C.shadow}`,
          }}
        >
          <MapPin size={9} color={C.coral} strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}
