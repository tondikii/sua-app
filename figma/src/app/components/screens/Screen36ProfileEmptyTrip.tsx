import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import {
  ProfileCard,
  ProfileHeader,
  ProfileOwnerActions,
  ProfileTripEmpty,
} from '../profile/ProfileParts';
import { SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'budi_santoso';

/** Profil pribadi — belum ada perjalanan di grid */
export function Screen36ProfileEmptyTrip() {
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
      <ProfileHeader username={USERNAME} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 88 }}>
        <div style={{ paddingTop: 4 }}>
          <ProfileCard
            identity={{
              initial: 'B',
              name: 'Budi Santoso',
              bio: 'Travel enthusiast 🌏 | Jakarta',
              location: 'Jakarta, Indonesia',
              avatarGradient: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
              avatarShadow: `0 8px 20px ${C.coral}40`,
            }}
            stats={[{ value: '0', label: 'Perjalanan' }]}
            action={<ProfileOwnerActions />}
          />
        </div>
        <div style={{ padding: '18px 22px 10px' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.charcoal }}>Perjalanan</span>
        </div>
        <ProfileTripEmpty isOwner />
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
