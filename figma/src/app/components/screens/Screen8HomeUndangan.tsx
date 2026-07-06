import {
  HomeHeader,
  HomePageShell,
  HomeScrollBody,
  HomeTabs,
  InvitationCard,
  type InvitationItem,
} from '../home/HomeBerandaParts';

const INVITATIONS: InvitationItem[] = [
  {
    id: 1,
    title: 'Raja Ampat Diving Trip',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=280&fit=crop&auto=format',
    inviter: 'rina_travel',
    inviterInitial: 'R',
    dateRange: '20–24 Agu 2026 · 08:00 – 17:00',
  },
  {
    id: 2,
    title: 'Bandung Food Hunt',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop&auto=format',
    inviter: 'budi_santoso',
    inviterInitial: 'B',
    dateRange: '5–6 Sep 2026 · Sepanjang hari',
  },
];

const TAB_COUNTS = { mendatang: 2, selesai: 1, undangan: 3 };

/** Beranda — tab Undangan */
export function Screen8HomeUndangan() {
  return (
    <HomePageShell>
      <HomeHeader unreadCount={5} />
      <HomeTabs activeTab="undangan" counts={TAB_COUNTS} />
      <HomeScrollBody>
        {INVITATIONS.map((item) => (
          <InvitationCard key={item.id} item={item} />
        ))}
      </HomeScrollBody>
    </HomePageShell>
  );
}
