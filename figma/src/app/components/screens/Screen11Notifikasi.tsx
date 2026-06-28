import { Bell, CheckCircle, UserPlus, CalendarClock, MapPin } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const notifs = [
  {
    id: 1,
    type: 'invite',
    icon: '✈️',
    iconBg: C.coralLight,
    avatarInitial: 'B',
    avatarColor: AVATAR_COLORS[0],
    title: 'Budi mengundangmu ke',
    highlight: 'Lombok Escape',
    time: '2 mnt lalu',
    unread: true,
    actions: ['terima', 'tolak'],
  },
  {
    id: 2,
    type: 'follow',
    icon: '👤',
    iconBg: C.tealLight,
    avatarInitial: 'S',
    avatarColor: AVATAR_COLORS[1],
    title: 'Siti mulai mengikuti kamu.',
    highlight: null,
    time: '1 jam lalu',
    unread: true,
    actions: ['follow'],
  },
  {
    id: 3,
    type: 'voting',
    icon: '🗳️',
    iconBg: '#FFF8ED',
    avatarInitial: 'G',
    avatarColor: AVATAR_COLORS[3],
    title: 'Voting tanggal',
    highlight: 'Bali Trip',
    titleSuffix: 'segera berakhir! Segera pilih tanggalmu.',
    time: '3 jam lalu',
    unread: false,
    actions: ['vote'],
  },
  {
    id: 4,
    type: 'update',
    icon: '📍',
    iconBg: C.tealLight,
    avatarInitial: 'R',
    avatarColor: AVATAR_COLORS[2],
    title: 'Rina menambahkan destinasi baru:',
    highlight: 'Bukit Merese',
    time: 'Kemarin',
    unread: false,
    actions: [],
  },
];

export function Screen11Notifikasi() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.light,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ padding: '6px 22px 16px', backgroundColor: C.light }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5 }}>
            Notifikasi
          </h1>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: C.coral,
              cursor: 'pointer',
              fontFamily: FONT,
              padding: 0,
            }}
          >
            Tandai semua dibaca
          </button>
        </div>
      </div>

      {/* Notif list */}
      <div
        style={{
          flex: 1,
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
        }}
      >
        {notifs.map((n) => (
          <div
            key={n.id}
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              padding: '14px 16px',
              boxShadow: `0 3px 16px ${C.shadow}`,
              border: n.unread ? `1.5px solid ${C.coral}30` : `1px solid ${C.border}`,
              position: 'relative',
            }}
          >
            {/* Unread dot */}
            {n.unread && (
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 8,
                  height: 8,
                  backgroundColor: C.coral,
                  borderRadius: '50%',
                }}
              />
            )}

            {/* Top row: avatar + content + time */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Avatar with type icon badge */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: n.avatarColor,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  {n.avatarInitial}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    backgroundColor: n.iconBg,
                    borderRadius: 7,
                    border: `2px solid ${C.white}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                  }}
                >
                  {n.icon}
                </div>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: C.charcoal, margin: '0 0 2px', lineHeight: 1.5, fontWeight: 500 }}>
                  {n.title}{' '}
                  {n.highlight && (
                    <span style={{ fontWeight: 800, color: C.charcoal }}>{n.highlight}</span>
                  )}
                  {n.titleSuffix && <span> {n.titleSuffix}</span>}
                </p>
                <span style={{ fontSize: 11, color: C.mutedLight, fontWeight: 500 }}>{n.time}</span>
              </div>
            </div>

            {/* Action buttons */}
            {n.actions.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {n.actions.includes('terima') && (
                  <button
                    style={{
                      flex: 1,
                      height: 36,
                      backgroundColor: C.coral,
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: `0 4px 14px ${C.coral}40`,
                      fontFamily: FONT,
                    }}
                  >
                    Terima
                  </button>
                )}
                {n.actions.includes('tolak') && (
                  <button
                    style={{
                      flex: 1,
                      height: 36,
                      backgroundColor: 'transparent',
                      color: C.muted,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    Tolak
                  </button>
                )}
                {n.actions.includes('follow') && (
                  <button
                    style={{
                      height: 36,
                      padding: '0 18px',
                      backgroundColor: C.tealLight,
                      color: C.teal,
                      border: `1.5px solid ${C.teal}40`,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    Follow Back
                  </button>
                )}
                {n.actions.includes('vote') && (
                  <button
                    style={{
                      height: 36,
                      padding: '0 18px',
                      backgroundColor: '#FFF8ED',
                      color: '#F59E0B',
                      border: `1.5px solid #F59E0B30`,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    Vote Sekarang →
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
