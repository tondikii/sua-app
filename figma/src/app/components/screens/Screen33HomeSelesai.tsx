import {
  HomeHeader,
  HomePageShell,
  HomeTabs,
  TripCard,
  type TripItem,
} from '../home/HomeBerandaParts';
import { TRIP_IMAGES } from '../tripImages';

const COMPLETED_TRIPS: TripItem[] = [
  {
    id: 1,
    title: 'Yogyakarta Heritage Trip',
    image: TRIP_IMAGES.borobudur,
    tags: ['#Budaya', '#Kuliner', '#Sejarah', '#Kota'],
    dateRange: '12–14 Mar 2026',
    avatars: ['A', 'D', 'R'],
  },
];

const TAB_COUNTS = { mendatang: 2, selesai: 1, undangan: 3 };

/** Beranda — tab Selesai */
export function Screen33HomeSelesai() {
  return (
    <HomePageShell>
      <HomeHeader unreadCount={2} />
      <HomeTabs activeTab="selesai" counts={TAB_COUNTS} />
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
        {COMPLETED_TRIPS.map((trip) => (
          <TripCard key={trip.id} trip={trip} dimmed />
        ))}
      </div>
    </HomePageShell>
  );
}
