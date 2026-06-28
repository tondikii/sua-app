import { UserPlus } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { ProfileCard, ProfileTripGrid } from '../profile/ProfileParts';
import { PageHeader, SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'karina_putri';

/** Profil pengguna lain — belum ada perjalanan */
export function Screen37PublicProfileEmptyTrip() {
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
      }}
    >
      <SafeAreaTop />
      <PageHeader title={USERNAME} background={C.light} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 88 }}>
        <div style={{ paddingTop: 4 }}>
          <ProfileCard
            identity={{
              initial: 'K',
              name: 'Karina Putri',
              bio: 'Suka eksplorasi kota & kafe hidden gem ☕',
              location: 'Bandung, Indonesia',
              avatarGradient: `linear-gradient(135deg, ${C.coral} 0%, #FFB347 100%)`,
              avatarShadow: `0 8px 22px ${C.coral}40`,
            }}
            stats={[
              { value: '120', label: 'Mengikuti' },
              { value: '340', label: 'Pengikut' },
              { value: '0', label: 'Perjalanan' },
            ]}
            action={
              <button
                type="button"
                style={{
                  width: '100%',
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
                  gap: 8,
                  boxShadow: `0 6px 18px ${C.coral}40`,
                }}
              >
                <UserPlus size={16} strokeWidth={2.5} />
                Ikuti
              </button>
            }
          />
        </div>
        <ProfileTripGrid trips={[]} emptyIsOwner={false} />
      </div>

      <BottomNav active="search" />
    </div>
  );
}
