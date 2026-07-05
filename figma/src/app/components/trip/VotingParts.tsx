import type { ReactNode } from 'react';
import { Calendar, MapPin, ListChecks, ThumbsUp, Plus, ChevronDown, MoreHorizontal } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { VotingCardMenuSheet } from './VotingCardMenuSheet';

export type VotingStatus = 'active' | 'ended' | 'expired';

const VOTING_STATUS_META: Record<
  VotingStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: 'Aktif', color: C.teal, bg: C.tealLight },
  ended: { label: 'Selesai', color: C.muted, bg: C.light },
  expired: { label: 'Berakhir', color: C.muted, bg: C.light },
};

export function VotingStatusBadge({ status }: { status: Exclude<VotingStatus, 'active'> }) {
  const meta = VOTING_STATUS_META[status];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: meta.color,
        backgroundColor: meta.bg,
        padding: '3px 8px',
        borderRadius: 8,
        flexShrink: 0,
      }}
    >
      {meta.label}
    </span>
  );
}

export type VotingType = 'tanggal' | 'destinasi' | 'lainnya';

export const VOTING_TYPE_META: Record<
  VotingType,
  { label: string; icon: typeof Calendar; color: string; bg: string }
> = {
  tanggal: { label: 'Tanggal', icon: Calendar, color: C.coral, bg: C.coralLight },
  destinasi: { label: 'Aktivitas', icon: MapPin, color: C.teal, bg: C.tealLight },
  lainnya: { label: 'Lainnya', icon: ListChecks, color: C.muted, bg: C.light },
};

type VotingTypeBadgeProps = { type: VotingType; compact?: boolean };

export function VotingTypeBadge({ type, compact = false }: VotingTypeBadgeProps) {
  const meta = VOTING_TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: 'fit-content',
        flexShrink: 0,
        gap: compact ? 4 : 5,
        backgroundColor: meta.bg,
        color: meta.color,
        fontSize: compact ? 10 : 11,
        fontWeight: 700,
        padding: compact ? '3px 8px' : '4px 10px',
        borderRadius: 20,
      }}
    >
      <Icon size={compact ? 10 : 11} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

type ActiveVotingSummary = {
  id: number;
  type: VotingType;
  title: string;
  subtitle: string;
  votes: number;
  totalMembers: number;
  status: 'active' | 'locked';
};

export function ActiveVotingCard({ voting }: { voting: ActiveVotingSummary }) {
  const meta = VOTING_TYPE_META[voting.type];
  const Icon = meta.icon;
  const isLocked = voting.status === 'locked';

  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 16,
        padding: '14px 16px',
        border: `1.5px solid ${isLocked ? C.teal + '50' : C.border}`,
        boxShadow: `0 3px 14px ${C.shadow}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            backgroundColor: meta.bg,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={meta.color} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <VotingTypeBadge type={voting.type} compact />
            {isLocked && (
              <span style={{ fontSize: 10, fontWeight: 700, color: C.teal }}>Dikunci</span>
            )}
          </div>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 2px' }}>{voting.title}</p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>{voting.subtitle}</p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: C.light,
            borderRadius: 20,
            padding: '5px 10px',
            flexShrink: 0,
          }}
        >
          <ThumbsUp size={11} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.charcoal }}>
            {voting.votes}/{voting.totalMembers}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CreateVotingFab() {
  return <CreateVotingButton />;
}

/** Tombol utama buat voting — selaras tombol tambah aktivitas */
export function CreateVotingButton({ label = 'Buat Voting Baru' }: { label?: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: 50,
        backgroundColor: C.coral,
        color: 'white',
        border: 'none',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: `0 8px 22px ${C.coral}45`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      <Plus size={16} strokeWidth={2.5} />
      {label}
    </button>
  );
}

export function VotingEmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 12px 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: C.tealLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <ListChecks size={32} color={C.teal} strokeWidth={2.5} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: '0 0 8px' }}>Belum ada voting</h3>
      <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
        Buat voting aktivitas, transportasi, atau keputusan lain untuk anggota trip.
      </p>
    </div>
  );
}

export function VotingTabEmptyBody({ footer }: { footer?: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 0',
        overflow: 'hidden',
      }}
    >
      <VotingEmptyState />
      {footer && <div style={{ padding: '24px 0 32px', flexShrink: 0 }}>{footer}</div>}
    </div>
  );
}

type VotingCollapseSectionProps = {
  type: VotingType;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  canManage?: boolean;
  showMenuOpen?: boolean;
  status?: VotingStatus;
  menuVariant?: 'active' | 'ended';
  children: ReactNode;
};

export function VotingCollapseSection({
  type,
  title,
  subtitle,
  defaultOpen = false,
  canManage = false,
  showMenuOpen = false,
  status = 'active',
  menuVariant,
  children,
}: VotingCollapseSectionProps) {
  const meta = VOTING_TYPE_META[type];
  const Icon = meta.icon;
  const isEnded = status === 'ended' || status === 'expired';
  const resolvedMenuVariant = menuVariant ?? (isEnded ? 'ended' : 'active');

  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: `0 3px 12px ${C.shadow}`,
        overflow: 'visible',
        opacity: isEnded ? 0.92 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '14px 12px 14px 16px',
        }}
      >
        <button
          type="button"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: FONT,
            textAlign: 'left',
            padding: 0,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: meta.bg,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={17} color={meta.color} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.charcoal, margin: 0 }}>{title}</p>
              {status === 'ended' && <VotingStatusBadge status="ended" />}
              {status === 'expired' && <VotingStatusBadge status="expired" />}
            </div>
            <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>{subtitle}</p>
          </div>
        </button>

        {canManage && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              title="Menu voting"
              style={{
                width: 34,
                height: 34,
                backgroundColor: showMenuOpen ? C.coralLight : C.light,
                border: showMenuOpen ? `1.5px solid ${C.coral}` : '1.5px solid transparent',
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: showMenuOpen ? `0 2px 8px ${C.coral}25` : 'none',
              }}
            >
              <MoreHorizontal size={15} color={showMenuOpen ? C.coral : C.muted} strokeWidth={2.5} />
            </button>
            {showMenuOpen && <VotingCardMenuSheet variant={resolvedMenuVariant} />}
          </div>
        )}

        <button
          type="button"
          title={defaultOpen ? 'Tutup' : 'Buka'}
          style={{
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ChevronDown
            size={18}
            color={C.muted}
            strokeWidth={2.5}
            style={{
              transform: defaultOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
      </div>
      {defaultOpen && (
        <div
          style={{
            padding: '0 16px 14px',
            borderTop: `1px solid ${C.border}`,
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function VoterAvatars({ initials, max = 4 }: { initials: string[]; max?: number }) {
  const shown = initials.slice(0, max);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((init, i) => (
        <div
          key={i}
          style={{
            width: 26,
            height: 26,
            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
            borderRadius: '50%',
            border: '2px solid white',
            marginLeft: i > 0 ? -8 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 800,
            color: 'white',
            zIndex: shown.length - i,
          }}
        >
          {init}
        </div>
      ))}
    </div>
  );
}

type VotingCandidateItem = {
  id: number;
  votes: number;
  avatars: string[];
  voted?: boolean;
  range?: string;
  days?: string;
  name?: string;
};

export function VotingCandidateList({
  items,
  labelKey,
  readOnly = false,
  winnerId,
}: {
  items: VotingCandidateItem[];
  labelKey: 'range' | 'name';
  readOnly?: boolean;
  winnerId?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12 }}>
      {items.map((cand) => {
        const isWinner = readOnly && winnerId === cand.id;
        const isVoted = !readOnly && cand.voted;

        return (
          <div
            key={cand.id}
            style={{
              backgroundColor: isWinner ? C.coralLight : C.light,
              borderRadius: 12,
              padding: '12px 14px',
              border: isWinner
                ? `1.5px solid ${C.coral}`
                : isVoted
                  ? `1.5px solid ${C.coral}`
                  : '1px solid transparent',
              opacity: readOnly && !isWinner ? 0.75 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: C.charcoal, margin: 0 }}>
                  {labelKey === 'range' ? cand.range : cand.name}
                </p>
                {cand.days && <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{cand.days}</p>}
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isWinner || isVoted ? C.coral : C.muted,
                  backgroundColor: isWinner || isVoted ? C.coralLight : C.white,
                  padding: '3px 8px',
                  borderRadius: 20,
                }}
              >
                <ThumbsUp size={10} strokeWidth={2.5} />
                {cand.votes}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <VoterAvatars initials={cand.avatars} />
              {readOnly ? (
                isWinner ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.coral }}>Pemenang</span>
                ) : null
              ) : isVoted ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.teal }}>✓ Voted</span>
              ) : (
                <button
                  type="button"
                  style={{
                    backgroundColor: C.white,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  Vote
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
