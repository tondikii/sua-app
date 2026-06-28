import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import {
  ProfileCard,
  ProfileHeader,
  ProfileOwnerActions,
  ProfileTripGrid,
  type ProfileTrip,
} from '../profile/ProfileParts';
import { TRIP_IMAGES } from '../tripImages';
import { SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'budi_santoso';

const TRIPS: ProfileTrip[] = [
  { id: 1, title: 'Raja Ampat', image: TRIP_IMAGES.rajaAmpat, tags: ['#Pantai', '#Snorkeling'] },
  { id: 2, title: 'Bromo Tengger', image: TRIP_IMAGES.bromo, tags: ['#Alam', '#Sunrise', '#Gunung'] },
  { id: 3, title: 'Gili Trawangan', image: TRIP_IMAGES.giliBeach, tags: ['#Pantai', '#Alam'] },
  { id: 4, title: 'Borobudur', image: TRIP_IMAGES.borobudur, tags: ['#Budaya', '#Sejarah'] },
];

export function Screen8Profile() {
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
            stats={[
              { value: '234', label: 'Mengikuti' },
              { value: '89', label: 'Pengikut' },
              { value: '12', label: 'Perjalanan' },
            ]}
            action={<ProfileOwnerActions />}
          />
        </div>
        <ProfileTripGrid trips={TRIPS} />
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
