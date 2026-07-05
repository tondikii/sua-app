import type { ReactNode } from 'react';
import { MapPin, Settings, Pencil } from 'lucide-react';
import { C, FONT } from '../colors';
import { EmptyTripsState, ProfileEmptyTripCta } from '../ui/EmptyTripsState';
import { TripTags } from '../ui/TripTags';

export type ProfileStat = { value: string; label: string };

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
  location: string;
  avatarGradient: string;
  avatarShadow: string;
};

/** Header profil tab sendiri — username di tengah */
export function ProfileHeader({ username }: { username: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 22px 14px',
        flexShrink: 0,
      }}
    >
      <h1
        style={{
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
    </div>
  );
}

export function ProfileStats({ stats }: { stats: ProfileStat[] }) {
  return (
    <div style={{ display: 'flex', backgroundColor: C.light, borderRadius: 14, padding: '12px 0' }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            flex: 1,
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, lineHeight: 1 }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
        </div>
      ))}
    </div>
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
        <div style={{ padding: '18px 22px 10px' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.charcoal }}>{title}</span>
        </div>
        <ProfileTripEmpty isOwner={emptyIsOwner} />
      </>
    );
  }

  return (
    <>
      <div style={{ padding: '18px 22px 10px' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.charcoal }}>{title}</span>
      </div>
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
              <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <p style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, margin: 0, lineHeight: 1.3 }}>{trip.title}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function ProfileCard({
  identity,
  stats,
  action,
}: {
  identity: ProfileIdentity;
  stats: ProfileStat[];
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        margin: '0 22px',
        backgroundColor: C.white,
        borderRadius: 22,
        padding: '20px 18px',
        boxShadow: `0 4px 20px ${C.shadow}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 22,
            background: identity.avatarGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 800,
            color: 'white',
            flexShrink: 0,
            boxShadow: identity.avatarShadow,
          }}
        >
          {identity.initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: '0 0 6px', letterSpacing: -0.3 }}>
            {identity.name}
          </h2>
          <p style={{ fontSize: 12, color: C.charcoal, margin: '0 0 6px', lineHeight: 1.5, fontWeight: 400 }}>
            {identity.bio}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color={C.teal} />
            <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>{identity.location}</span>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: action ? 14 : 0 }}>
        <ProfileStats stats={stats} />
      </div>
      {action}
    </div>
  );
}

export function ProfileOwnerActions() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        type="button"
        style={{
          flex: 1,
          height: 42,
          backgroundColor: C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Pencil size={15} strokeWidth={2.5} />
        Edit Profil
      </button>
      <button
        type="button"
        style={{
          width: 42,
          height: 42,
          backgroundColor: C.light,
          color: C.charcoal,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label="Pengaturan"
      >
        <Settings size={18} color={C.charcoal} strokeWidth={2} />
      </button>
    </div>
  );
}
