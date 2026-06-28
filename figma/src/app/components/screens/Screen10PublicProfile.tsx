import { UserPlus } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { ProfileCard, ProfileTripGrid, type ProfileTrip } from '../profile/ProfileParts';
import { TRIP_IMAGES } from '../tripImages';
import { PageHeader, SafeAreaTop } from '../ui/ScreenChrome';

const USERNAME = 'rinadwi_travel';

const TRIPS: ProfileTrip[] = [
  { id: 1, title: 'Borobudur', image: TRIP_IMAGES.borobudur, tags: ['#Budaya', '#Sejarah'] },
  { id: 2, title: 'Gunung Merapi', image: TRIP_IMAGES.merapi, tags: ['#Alam', '#Gunung', '#Sunrise'] },
  { id: 3, title: 'Tumpak Sewu', image: TRIP_IMAGES.tumpakSewu, tags: ['#Alam', '#Air Terjun'] },
  { id: 4, title: 'Bali Rice Terraces', image: TRIP_IMAGES.baliTerraces, tags: ['#Alam', '#Budaya', '#Foto'] },
];

/** Profil pengguna lain — username di header kiri, kartu tanpa username */
export function Screen10PublicProfile() {
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
              initial: 'R',
              name: 'Rina Dwi Lestari',
              bio: 'Pecinta alam & kuliner 🌿 | Yogyakarta',
              location: 'Yogyakarta, Indonesia',
              avatarGradient: `linear-gradient(135deg, ${C.teal} 0%, #7FE3DE 100%)`,
              avatarShadow: `0 8px 22px ${C.teal}40`,
            }}
            stats={[
              { value: '234', label: 'Mengikuti' },
              { value: '1.2K', label: 'Pengikut' },
              { value: '28', label: 'Perjalanan' },
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
        <ProfileTripGrid trips={TRIPS} />
      </div>

      <BottomNav active="search" />
    </div>
  );
}
