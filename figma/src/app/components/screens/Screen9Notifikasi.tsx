import { C, AVATAR_COLORS, FONT } from '../colors';
import { HeaderTextButton, PageHeader, SafeAreaTop } from '../ui/ScreenChrome';

type NotifAction = 'terima' | 'tolak' | 'vote';

type NotifItem = {
  id: number;
  type: 'invite' | 'voting' | 'activity';
  icon: string;
  iconBg: string;
  avatarInitial: string;
  avatarColor: string;
  title: string;
  highlight?: string;
  titleSuffix?: string;
  time: string;
  unread: boolean;
  actions: NotifAction[];
};

const notifs: NotifItem[] = [
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
    type: 'voting',
    icon: '🗳️',
    iconBg: '#FFF8ED',
    avatarInitial: 'G',
    avatarColor: AVATAR_COLORS[3],
    title: 'Voting Tanggal',
    highlight: 'Bali Trip',
    titleSuffix: 'segera berakhir.',
    time: '3 jam lalu',
    unread: true,
    actions: ['vote'],
  },
  {
    id: 3,
    type: 'voting',
    icon: '🗳️',
    iconBg: '#FFF8ED',
    avatarInitial: 'A',
    avatarColor: AVATAR_COLORS[1],
    title: 'Voting Destinasi',
    highlight: 'Raja Ampat',
    titleSuffix: 'deadline besok.',
    time: '5 jam lalu',
    unread: false,
    actions: ['vote'],
  },
  {
    id: 4,
    type: 'activity',
    icon: '📋',
    iconBg: C.tealLight,
    avatarInitial: 'R',
    avatarColor: AVATAR_COLORS[2],
    title: 'Rina menambahkan aktivitas',
    highlight: 'Sunrise di Puncak Jayagiri',
    titleSuffix: 'di Bali Trip.',
    time: 'Kemarin',
    unread: false,
    actions: [],
  },
];

export function Screen9Notifikasi() {
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
      <SafeAreaTop />

      <PageHeader
        title="Notifikasi"
        background={C.light}
        right={<HeaderTextButton>Tandai semua dibaca</HeaderTextButton>}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '0 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
          overflowX: 'hidden',
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
              cursor: n.actions.length === 0 ? 'pointer' : 'default',
            }}
          >
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

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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

              <div style={{ flex: 1, minWidth: 0, paddingRight: n.unread ? 12 : 0 }}>
                <p style={{ fontSize: 13, color: C.charcoal, margin: '0 0 2px', lineHeight: 1.5, fontWeight: 500 }}>
                  {n.title}
                  {n.highlight && (
                    <>
                      {' '}
                      <span style={{ fontWeight: 800, color: C.charcoal }}>{n.highlight}</span>
                    </>
                  )}
                  {n.titleSuffix && <span> {n.titleSuffix}</span>}
                </p>
                <span style={{ fontSize: 11, color: C.mutedLight, fontWeight: 500 }}>{n.time}</span>
              </div>
            </div>

            {n.actions.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {n.actions.includes('terima') && (
                  <button
                    type="button"
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
                    type="button"
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
                {n.actions.includes('vote') && (
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      height: 36,
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
    </div>
  );
}
