import { SearchX } from 'lucide-react';
import { C, FONT } from '../colors';

type SearchEmptyStateProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

/** Empty state konsisten untuk pencarian user / undang teman */
export function SearchEmptyState({
  title = 'Tidak ada hasil',
  description = 'Coba cari dengan nama lengkap atau username yang berbeda. Pastikan ejaannya benar.',
  compact = false,
}: SearchEmptyStateProps) {
  const iconSize = compact ? 28 : 32;
  const boxSize = compact ? 64 : 72;
  const radius = compact ? 20 : 24;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '0 20px 40px' : '0 40px 100px',
        textAlign: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: boxSize,
          height: boxSize,
          backgroundColor: C.light,
          borderRadius: radius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: compact ? 16 : 18,
        }}
      >
        <SearchX size={iconSize} color={C.muted} strokeWidth={2} />
      </div>
      <h2
        style={{
          fontSize: compact ? 15 : 17,
          fontWeight: 800,
          color: C.charcoal,
          margin: '0 0 8px',
          letterSpacing: compact ? 0 : -0.3,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: compact ? 13 : 13,
          color: C.muted,
          margin: 0,
          lineHeight: 1.6,
          fontWeight: 500,
          maxWidth: 280,
        }}
      >
        {description}
      </p>
    </div>
  );
}
