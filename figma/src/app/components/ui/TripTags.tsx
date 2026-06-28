import { C } from '../colors';

type TripTagsProps = {
  tags: string[];
  /** Tampilkan di body kartu (Beranda) atau overlay gambar (Profil grid) */
  variant?: 'card' | 'overlay';
  maxVisible?: number;
};

/** Chip tag perjalanan — overflow ditangani saat tag banyak */
export function TripTags({ tags, variant = 'card', maxVisible }: TripTagsProps) {
  const limit = maxVisible ?? (variant === 'overlay' ? 2 : 3);
  const visible = tags.slice(0, limit);
  const overflow = tags.length - limit;

  const isOverlay = variant === 'overlay';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: isOverlay ? 'nowrap' : 'wrap',
        gap: isOverlay ? 4 : 6,
        marginBottom: isOverlay ? 0 : 13,
        maxWidth: '100%',
        overflow: isOverlay ? 'hidden' : 'visible',
      }}
    >
      {visible.map((tag) => (
        <span
          key={tag}
          style={{
            backgroundColor: C.tealLight,
            color: C.teal,
            fontSize: isOverlay ? 8 : 11,
            fontWeight: 700,
            padding: isOverlay ? '2px 6px' : '4px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            flexShrink: isOverlay ? 0 : undefined,
            lineHeight: 1.3,
          }}
        >
          {tag}
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            backgroundColor: isOverlay ? 'rgba(255,255,255,0.92)' : C.light,
            color: isOverlay ? C.charcoal : C.muted,
            fontSize: isOverlay ? 8 : 11,
            fontWeight: 700,
            padding: isOverlay ? '2px 6px' : '4px 8px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: isOverlay ? `1px solid ${C.border}` : 'none',
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
