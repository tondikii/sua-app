import { ChevronRight, Search, X } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';

export type SearchUser = {
  id: number;
  name: string;
  username: string;
  initial: string;
  color?: string;
  avatarGradient?: string;
  trips?: number;
};

export const RINA_GRADIENT = `linear-gradient(135deg, ${C.teal} 0%, #7FE3DE 100%)`;

export const SEARCH_RECENT: SearchUser[] = [
  {
    id: 1,
    name: 'Rina Dwi Lestari',
    username: 'rinadwi_travel',
    initial: 'R',
    avatarGradient: RINA_GRADIENT,
    trips: 28,
  },
  {
    id: 2,
    name: 'Andi Firmansyah',
    username: 'andifirman',
    initial: 'A',
    color: AVATAR_COLORS[1],
    trips: 12,
  },
];

export const SEARCH_RESULTS: SearchUser[] = [
  {
    id: 1,
    name: 'Rina Dwi Lestari',
    username: 'rinadwi_travel',
    initial: 'R',
    avatarGradient: RINA_GRADIENT,
    trips: 28,
  },
  {
    id: 2,
    name: 'Karina Putri',
    username: 'karina_putri',
    initial: 'K',
    color: AVATAR_COLORS[4],
    trips: 5,
  },
];

type SearchInputProps = {
  value?: string;
  placeholder?: string;
  focused?: boolean;
};

/** Field pencarian — ikon search, teks/placeholder, tombol clear (X) saat ada nilai */
export function SearchInput({ value, placeholder = 'Cari...', focused }: SearchInputProps) {
  const isActive = focused ?? Boolean(value);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: C.light,
        borderRadius: 14,
        padding: '12px 16px',
        border: `1.5px solid ${isActive ? C.coral : C.border}`,
        boxShadow: isActive ? `0 0 0 3px ${C.coralLight}` : 'none',
      }}
    >
      <Search size={16} color={isActive ? C.coral : C.muted} strokeWidth={2.5} />
      {value ? (
        <span style={{ fontSize: 14, color: C.charcoal, fontWeight: 500, flex: 1 }}>{value}</span>
      ) : (
        <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 500, flex: 1 }}>
          {placeholder}
        </span>
      )}
      {value && (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: C.muted,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <X size={11} color="white" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

type SearchBarProps = {
  query?: string;
  focused?: boolean;
  placeholder?: string;
};

export function SearchBar({
  query,
  focused,
  placeholder = 'Cari nama atau username...',
}: SearchBarProps) {
  return <SearchInput value={query} focused={focused} placeholder={placeholder} />;
}

type SearchUserRowProps = {
  user: SearchUser;
  variant: 'recent' | 'result';
  showBorder?: boolean;
  highlight?: boolean;
};

export function SearchUserRow({
  user,
  variant,
  showBorder = true,
  highlight = false,
}: SearchUserRowProps) {
  const avatarSize = 44;
  const avatarBg = user.avatarGradient ?? user.color ?? AVATAR_COLORS[0];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: showBorder ? `1px solid ${C.border}` : 'none',
        cursor: highlight ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          background: avatarBg,
          borderRadius: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 800,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {user.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: C.charcoal,
            margin: 0,
            letterSpacing: -0.2,
          }}
        >
          {user.name}
        </p>
        <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>
          @{user.username}
        </p>
        {variant === 'result' && user.trips !== undefined && (
          <p style={{ fontSize: 11, color: C.mutedLight, margin: '2px 0 0', fontWeight: 500 }}>
            {user.trips} perjalanan
          </p>
        )}
      </div>
      {variant === 'result' && (
        <ChevronRight size={18} color={C.mutedLight} strokeWidth={2.5} style={{ flexShrink: 0 }} />
      )}
    </div>
  );
}
