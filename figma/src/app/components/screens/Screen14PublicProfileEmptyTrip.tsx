import { C, FONT } from '../colors';
import { ProfileCard, ProfileTripGrid } from '../profile/ProfileParts';
import { PageHeader, SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'karina_putri';

/** Profil pengguna lain — belum ada perjalanan */
export function Screen14PublicProfileEmptyTrip() {
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

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ paddingTop: 4 }}>
          <ProfileCard
            identity={{
              initial: 'K',
              name: 'Karina Putri',
              bio: 'Suka eksplorasi kota & kafe hidden gem ☕',
              avatarGradient: `linear-gradient(135deg, ${C.coral} 0%, #FFB347 100%)`,
              avatarShadow: `0 8px 22px ${C.coral}40`,
            }}
            tripCount={0}
          />
        </div>
        <ProfileTripGrid trips={[]} emptyIsOwner={false} />
      </div>
    </div>
  );
}
