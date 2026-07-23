import type { ReactNode } from 'react';
import { Globe, Settings } from 'lucide-react';
import { C } from '../colors';
import { EmptyTripsState, ProfileEmptyTripCta } from '../ui/EmptyTripsState';
import { TripTags } from '../ui/TripTags';

export type ProfileTrip = {
  id: number;
  title: string;
  image: string;
  tags: string[];
};

type ProfileIdentity = {
  initial: string;
  name: string;
  bio: string;
  websiteUrl?: string;
  avatarGradient: string;
  avatarShadow: string;
};

export function ProfileStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: C.light,
        borderRadius: 12,
        padding: '9px 0',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            flex: 1,
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: C.charcoal,
              lineHeight: 1,
              letterSpacing: -0.4,
            }}
          >
            {stat.value}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 3, fontWeight: 600 }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Header profil tab sendiri — username di tengah, aksi opsional kanan (simetris) */
export function ProfileHeader({ username, action }: { username: string; action?: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 22px 14px',
        flexShrink: 0,
      }}
    >
      <div style={{ width: 40, flexShrink: 0 }} />
      <h1
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: 800,
          color: C.charcoal,
          margin: 0,
          letterSpacing: -0.3,
          textAlign: 'center',
        }}
      >
        {username}
      </h1>
      <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {action}
      </div>
    </div>
  );
}

export function ProfileSettingsButton() {
  return (
    <button
      type="button"
      aria-label="Pengaturan"
      style={{
        width: 40,
        height: 40,
        backgroundColor: C.white,
        color: C.charcoal,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${C.shadow}`,
      }}
    >
      <Settings size={18} color={C.charcoal} strokeWidth={2} />
    </button>
  );
}

export function ProfileTripEmpty({ isOwner = true }: { isOwner?: boolean }) {
  return (
    <EmptyTripsState
      size="profile"
      description={
        isOwner
          ? 'Mulai rencanakan liburan pertamamu bersama teman-teman.'
          : 'Pengguna ini belum memiliki perjalanan.'
      }
      cta={isOwner ? <ProfileEmptyTripCta compact /> : undefined}
    />
  );
}

function ProfileTripSectionHeader({ title }: { title: string }) {
  return (
    <div style={{ padding: '18px 22px 10px' }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.charcoal }}>{title}</span>
    </div>
  );
}

export function ProfileTripGrid({
  trips,
  title = 'Perjalanan',
  emptyIsOwner = true,
}: {
  trips: ProfileTrip[];
  title?: string;
  emptyIsOwner?: boolean;
}) {
  if (trips.length === 0) {
    return (
      <>
        <ProfileTripSectionHeader title={title} />
        <ProfileTripEmpty isOwner={emptyIsOwner} />
      </>
    );
  }

  return (
    <>
      <ProfileTripSectionHeader title={title} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '0 22px',
        }}
      >
        {trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: C.white,
              boxShadow: `0 3px 14px ${C.shadow}`,
            }}
          >
            <div style={{ height: 96, backgroundColor: '#D8D4CC', position: 'relative' }}>
              <img
                src={trip.image}
                alt={trip.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  right: 8,
                  display: 'flex',
                }}
              >
                <TripTags tags={trip.tags} variant="overlay" />
              </div>
            </div>
            <div style={{ padding: '9px 10px 10px' }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.charcoal,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {trip.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function ProfileCard({
  identity,
  tripCount,
}: {
  identity: ProfileIdentity;
  tripCount: number;
}) {
  return (
    <div
      style={{
        margin: '0 22px',
        backgroundColor: C.white,
        borderRadius: 22,
        padding: '16px 16px 14px',
        boxShadow: `0 4px 20px ${C.shadow}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 11 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: identity.avatarGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            color: 'white',
            flexShrink: 0,
            boxShadow: identity.avatarShadow,
          }}
        >
          {identity.initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.charcoal,
              margin: '0 0 4px',
              letterSpacing: -0.3,
            }}
          >
            {identity.name}
          </h2>
          <p
            style={{
              fontSize: 12,
              color: C.charcoal,
              margin: '0 0 5px',
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            {identity.bio}
          </p>
          {identity.websiteUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={11} color={C.teal} strokeWidth={2.2} />
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>
                {identity.websiteUrl}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <ProfileStats stats={[{ value: String(tripCount), label: 'Perjalanan' }]} />
    </div>
  );
}
