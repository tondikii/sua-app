import {
  HomeHeader,
  HomePageShell,
  HomeTabs,
  TripCard,
  type TripItem,
} from '../home/HomeBerandaParts';
import { TRIP_IMAGES } from '../tripImages';

const UPCOMING_TRIPS: TripItem[] = [
  {
    id: 1,
    title: 'Lombok Weekend Escape',
    image: TRIP_IMAGES.giliBeach,
    tags: ['#Pantai', '#Alam', '#Snorkeling', '#Sunset'],
    dateRange: '15–18 Jun 2026',
    avatars: ['R', 'B', 'A', 'D'],
  },
  {
    id: 2,
    title: 'Bali Cultural Retreat',
    image: TRIP_IMAGES.baliTerraces,
    tags: ['#Budaya', '#Pantai', '#Kuliner'],
    dateRange: '3–7 Jul 2026',
    avatars: ['S', 'M', 'R'],
  },
];

const TAB_COUNTS = { mendatang: 2, selesai: 1, undangan: 3 };

/** Beranda — tab Mendatang · lonceng dengan jumlah notifikasi */
export function Screen5Home() {
  return (
    <HomePageShell>
      <HomeHeader unreadCount={5} />
      <HomeTabs activeTab="mendatang" counts={TAB_COUNTS} />
      <div
        style={{
          flex: 1,
          padding: '20px 22px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {UPCOMING_TRIPS.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </HomePageShell>
  );
}
