import { HomeHeader, HomePageShell, HomeTabs } from '../home/HomeBerandaParts';
import { EmptyTripsState, ProfileEmptyTripCta } from '../ui/EmptyTripsState';

const TAB_COUNTS = { mendatang: 0, selesai: 1, undangan: 3 };

/** Beranda kosong — tab Mendatang · lonceng tanpa notifikasi */
export function Screen6EmptyBeranda() {
  return (
    <HomePageShell>
      <HomeHeader unreadCount={0} />
      <HomeTabs activeTab="mendatang" counts={TAB_COUNTS} />
      <EmptyTripsState
        description="Mulai rencanakan liburan pertamamu bersama teman-teman."
        cta={<ProfileEmptyTripCta />}
      />
    </HomePageShell>
  );
}
