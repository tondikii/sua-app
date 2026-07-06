import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import {
  ProfileCard,
  ProfileHeader,
  ProfileSettingsButton,
  ProfileTripGrid,
} from '../profile/ProfileParts';
import { SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'budi_santoso';
const BIO = 'Travel enthusiast 🌏 | Jakarta | Suka jelajahi pantai dan budaya lokal Indonesia 🇮🇩';
const WEBSITE = 'instagram.com/budi_santoso';

/** Profil pribadi — belum ada perjalanan di grid */
export function Screen16ProfileEmptyTrip() {
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
      <ProfileHeader username={USERNAME} action={<ProfileSettingsButton />} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 88 }}>
        <div style={{ paddingTop: 4 }}>
          <ProfileCard
            identity={{
              initial: 'B',
              name: 'Budi Santoso',
              bio: BIO,
              websiteUrl: WEBSITE,
              avatarGradient: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
              avatarShadow: `0 8px 20px ${C.coral}40`,
            }}
            tripCount={0}
          />
        </div>
        <ProfileTripGrid trips={[]} />
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
