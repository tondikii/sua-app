import type { ReactElement } from 'react';
import '../styles/index.css';
import { C, FONT } from './components/colors';
import { PhoneFrame } from './components/PhoneFrame';

// §1 Onboarding
import { Screen1Splash } from './components/screens/Screen1Splash';
import { Screen2EduOnboarding } from './components/screens/Screen2EduOnboarding';

// §2 Autentikasi
import { Screen3Auth } from './components/screens/Screen3Auth';
import { Screen4Username } from './components/screens/Screen4Username';

// §3 Beranda
import { Screen5Home } from './components/screens/Screen5Home';
import { Screen6EmptyBeranda } from './components/screens/Screen6EmptyBeranda';
import { Screen33HomeSelesai } from './components/screens/Screen33HomeSelesai';
import { Screen34HomeUndangan } from './components/screens/Screen34HomeUndangan';
import { Screen27Notifikasi } from './components/screens/Screen27Notifikasi';

// §4 Pencarian
import { Screen35SearchIdle } from './components/screens/Screen35SearchIdle';
import { Screen7SearchUser } from './components/screens/Screen7SearchUser';
import { Screen40SearchNoResults } from './components/screens/Screen40SearchNoResults';
import { Screen10PublicProfile } from './components/screens/Screen10PublicProfile';
import { Screen37PublicProfileEmptyTrip } from './components/screens/Screen37PublicProfileEmptyTrip';

// §5 Profil
import { Screen8Profile } from './components/screens/Screen8Profile';
import { Screen36ProfileEmptyTrip } from './components/screens/Screen36ProfileEmptyTrip';
import { Screen9EditProfil } from './components/screens/Screen9EditProfil';
import { Screen11Settings } from './components/screens/Screen11Settings';
import { Screen39SettingsHelpFaq } from './components/screens/Screen39SettingsHelpFaq';
import { Screen38SettingsDeleteAccount } from './components/screens/Screen38SettingsDeleteAccount';

// §6 Pembuatan Perjalanan
import { Screen12Create } from './components/screens/Screen12Create';
import { Screen13MultiDatePicker } from './components/screens/Screen13MultiDatePicker';
import { Screen14FormValidation } from './components/screens/Screen14FormValidation';
import { Screen57PickDateCandidate1 } from './components/screens/Screen57PickDateCandidate1';
import { Screen58PickDateCandidate2 } from './components/screens/Screen58PickDateCandidate2';
import { Screen59DateCandidatesComplete } from './components/screens/Screen59DateCandidatesComplete';
import { Screen67CreateTripFixedDate } from './components/screens/Screen67CreateTripFixedDate';
import { Screen68CreateTripFixedValidation } from './components/screens/Screen68CreateTripFixedValidation';
import { Screen70CreateTripUncertainDate } from './components/screens/Screen70CreateTripUncertainDate';
import { Screen71CreateTripUncertainInfo } from './components/screens/Screen71CreateTripUncertainInfo';
import { Screen78CreateTripEmpty } from './components/screens/Screen78CreateTripEmpty';
import { Screen80CreateTripCandidate1Saved } from './components/screens/Screen80CreateTripCandidate1Saved';
import { Screen81CreateTripTwoCandidatesSaved } from './components/screens/Screen81CreateTripTwoCandidatesSaved';
import { Screen82CreateTripSubmitting } from './components/screens/Screen82CreateTripSubmitting';
import { Screen84InvitePartialInvited } from './components/screens/Screen84InvitePartialInvited';
import { Screen20BottomSheetUndang } from './components/screens/Screen20BottomSheetUndang';
import { Screen43InviteSearchResults } from './components/screens/Screen43InviteSearchResults';
import { Screen44InviteSearchEmpty } from './components/screens/Screen44InviteSearchEmpty';
import { Screen45InviteSent } from './components/screens/Screen45InviteSent';

// §7 Detail Perjalanan — Itinerary
import { Screen15Destinations } from './components/screens/Screen15Destinations';
import { Screen72DestinationsFixedDate } from './components/screens/Screen72DestinationsFixedDate';
import { Screen77ItineraryEmpty } from './components/screens/Screen77ItineraryEmpty';
import { Screen18BottomSheetDestinasi } from './components/screens/Screen18BottomSheetDestinasi';
import { Screen19DestinationDetail } from './components/screens/Screen19DestinationDetail';
import { Screen85ActivityAddLinked } from './components/screens/Screen85ActivityAddLinked';
import { Screen86ActivityCoverPicker } from './components/screens/Screen86ActivityCoverPicker';
import { Screen87ActivityDetailNoCover } from './components/screens/Screen87ActivityDetailNoCover';
import { Screen88ActivityEdit } from './components/screens/Screen88ActivityEdit';
import { Screen89ActivityMapsNoThumb } from './components/screens/Screen89ActivityMapsNoThumb';
import { Screen90ActivityCoverIconPicker } from './components/screens/Screen90ActivityCoverIconPicker';
import { Screen91ActivityTripMediaCover } from './components/screens/Screen91ActivityTripMediaCover';
import { Screen92ActivityDetailBare } from './components/screens/Screen92ActivityDetailBare';
import { Screen93ActivityItemMenu } from './components/screens/Screen93ActivityItemMenu';

// §8 Detail Perjalanan — Voting
import { Screen16Voting } from './components/screens/Screen16Voting';
import { Screen107VotingEmpty } from './components/screens/Screen107VotingEmpty';
import { Screen42CreateVoting } from './components/screens/Screen42CreateVoting';
import { Screen53CreateVotingDetails } from './components/screens/Screen53CreateVotingDetails';
import { Screen54DeleteVotingModal } from './components/screens/Screen54DeleteVotingModal';
import { Screen55EditVoting } from './components/screens/Screen55EditVoting';
import { Screen56VotingCardMenu } from './components/screens/Screen56VotingCardMenu';
import { Screen60CreateVotingTanggal } from './components/screens/Screen60CreateVotingTanggal';
import { Screen61CreateVotingTanggalDetails } from './components/screens/Screen61CreateVotingTanggalDetails';
import { Screen62CreateVotingTanggalPickCandidate } from './components/screens/Screen62CreateVotingTanggalPickCandidate';
import { Screen73VotingTanggalPickCandidate3 } from './components/screens/Screen73VotingTanggalPickCandidate3';
import { Screen74VotingTanggalDetailsComplete } from './components/screens/Screen74VotingTanggalDetailsComplete';
import { Screen75VotingTanggalDetailsTwoCandidates } from './components/screens/Screen75VotingTanggalDetailsTwoCandidates';
import { Screen64VotingEndedPipeline } from './components/screens/Screen64VotingEndedPipeline';
import { Screen65VotingEndedMenu } from './components/screens/Screen65VotingEndedMenu';
import { Screen66VotingExpired } from './components/screens/Screen66VotingExpired';
import { Screen21StatusLocked } from './components/screens/Screen21StatusLocked';
import { Screen48VotingLockedDestinasi } from './components/screens/Screen48VotingLockedDestinasi';
import { Screen49VotingLockedLainnya } from './components/screens/Screen49VotingLockedLainnya';

// §9 Detail Perjalanan — Chat
import { Screen17Chat } from './components/screens/Screen17Chat';
import { Screen23EmptyChat } from './components/screens/Screen23EmptyChat';
import { Screen24ChatLongPress } from './components/screens/Screen24ChatLongPress';
import { Screen97ChatAttachMenu } from './components/screens/Screen97ChatAttachMenu';
import {
  Screen99ChatSendPhoto,
  Screen100ChatSendVideo,
  Screen101ChatSendPhotoCaption,
  Screen102ChatSendVideoCaption,
} from './components/screens/Screen99ChatSendMedia';
import { Screen103ChatPhotoSent } from './components/screens/Screen103ChatPhotoSent';
import { Screen104ChatVideoSent } from './components/screens/Screen104ChatVideoSent';
import { Screen105ChatPhotoReceived } from './components/screens/Screen105ChatPhotoReceived';
import { Screen106ChatVideoReceived } from './components/screens/Screen106ChatVideoReceived';

// §10 Detail Perjalanan — Media
import { Screen41TripDocuments } from './components/screens/Screen41TripDocuments';
import { Screen98MediaFromChat } from './components/screens/Screen98MediaFromChat';

// §11 Detail Perjalanan — Kelola Trip
import { Screen50TripMembers } from './components/screens/Screen50TripMembers';
import { Screen22CalendarSyncModal } from './components/screens/Screen22CalendarSyncModal';
import { Screen51TripEdit } from './components/screens/Screen51TripEdit';
import { Screen52TripDelete } from './components/screens/Screen52TripDelete';

// §12 Wishlist
import { Screen25Wishlist } from './components/screens/Screen25Wishlist';
import { Screen26BottomSheetWishlist } from './components/screens/Screen26BottomSheetWishlist';
import { Screen108WishlistEmpty } from './components/screens/Screen108WishlistEmpty';
import { Screen110WishlistFilterEmpty } from './components/screens/Screen110WishlistFilterEmpty';
import { Screen111AddWishlistEmpty } from './components/screens/Screen111AddWishlistEmpty';
import { Screen112AddWishlistValidation } from './components/screens/Screen112AddWishlistValidation';
import { Screen113WishlistDetail } from './components/screens/Screen113WishlistDetail';
import { Screen114EditWishlist } from './components/screens/Screen114EditWishlist';
import { Screen115WishlistCardMenu } from './components/screens/Screen115WishlistCardMenu';
import { Screen116WishlistDelete } from './components/screens/Screen116WishlistDelete';
import { Screen117WishlistToTripEmpty } from './components/screens/Screen117WishlistToTripEmpty';
import { Screen118WishlistToTripReady } from './components/screens/Screen118WishlistToTripReady';
import { Screen119WishlistToTripInvite } from './components/screens/Screen119WishlistToTripInvite';
import { Screen120ItineraryFromWishlist } from './components/screens/Screen120ItineraryFromWishlist';

// §13 System States & Micro-interactions
import { Screen28SkeletonLoading } from './components/screens/Screen28SkeletonLoading';
import { Screen29ToastComponents } from './components/screens/Screen29ToastComponents';
import { Screen30Error } from './components/screens/Screen30Error';
import { Screen31DarkBeranda } from './components/screens/Screen31DarkBeranda';
import { Screen32DesignTokens } from './components/screens/Screen32DesignTokens';
import { Screen94MediaViewerPhoto } from './components/screens/Screen94MediaViewerPhoto';
import { Screen95MediaViewerVideo } from './components/screens/Screen95MediaViewerVideo';
import { Screen96MediaViewerVideoPlaying } from './components/screens/Screen96MediaViewerVideoPlaying';

type WorkflowSection = {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  screens: { index: number; label: string; component: ReactElement }[];
};

/** Pengelompokan selaras docs/WORKFLOW.md · nomor layar = indeks Screen{N} */
const workflowSections: WorkflowSection[] = [
  {
    id: 1,
    title: '1. Onboarding Layar Awal',
    subtitle: 'Splash · Carousel 4 slide (pengenalan → masalah & solusi per BRIEF)',
    accent: C.coral,
    screens: [
      { index: 1, label: 'Splash Screen', component: <Screen1Splash /> },
      { index: 2, label: 'Edu Onboarding', component: <Screen2EduOnboarding /> },
    ],
  },
  {
    id: 2,
    title: '2. Autentikasi (Google Sign-In)',
    subtitle: 'Lanjutkan dengan Google · Buat username unik (pengguna baru)',
    accent: C.teal,
    screens: [
      { index: 3, label: 'Auth & Onboarding', component: <Screen3Auth /> },
      { index: 4, label: 'Buat Username', component: <Screen4Username /> },
    ],
  },
  {
    id: 3,
    title: '3. Beranda (Home) — Tab 1',
    subtitle: 'Tab Mendatang · Selesai · Undangan · Notifikasi · Empty state',
    accent: C.coral,
    screens: [
      { index: 5, label: 'Beranda — Mendatang', component: <Screen5Home /> },
      { index: 6, label: 'Empty — Beranda', component: <Screen6EmptyBeranda /> },
      { index: 33, label: 'Beranda — Selesai', component: <Screen33HomeSelesai /> },
      { index: 34, label: 'Beranda — Undangan', component: <Screen34HomeUndangan /> },
      { index: 27, label: 'Notifikasi', component: <Screen27Notifikasi /> },
    ],
  },
  {
    id: 4,
    title: '4. Pencarian (Cari) — Tab 2',
    subtitle: 'Idle · Hasil · Kosong · Profil publik (dari hasil cari)',
    accent: C.teal,
    screens: [
      { index: 35, label: 'Cari — Idle', component: <Screen35SearchIdle /> },
      { index: 7, label: 'Cari — Hasil', component: <Screen7SearchUser /> },
      { index: 40, label: 'Cari — Tidak Ada Hasil', component: <Screen40SearchNoResults /> },
      { index: 10, label: 'Profil Publik', component: <Screen10PublicProfile /> },
      { index: 37, label: 'Profil Publik — Empty Trip', component: <Screen37PublicProfileEmptyTrip /> },
    ],
  },
  {
    id: 5,
    title: '5. Profil — Tab 5',
    subtitle: 'Profil pribadi · Empty trip · Edit · Pengaturan · Bantuan · Hapus akun',
    accent: C.coral,
    screens: [
      { index: 8, label: 'Profil & Eksplorasi', component: <Screen8Profile /> },
      { index: 36, label: 'Profil — Empty Trip', component: <Screen36ProfileEmptyTrip /> },
      { index: 9, label: 'Edit Profil', component: <Screen9EditProfil /> },
      { index: 11, label: 'Pengaturan', component: <Screen11Settings /> },
      { index: 39, label: 'Bantuan & FAQ', component: <Screen39SettingsHelpFaq /> },
      { index: 38, label: 'Hapus Akun', component: <Screen38SettingsDeleteAccount /> },
    ],
  },
  {
    id: 6,
    title: '6. Pembuatan Perjalanan — Tab [+]',
    subtitle: 'A: Tanggal pasti · B: Kandidat tanggal · Undang · Semua state untuk slicing',
    accent: C.teal,
    screens: [
      { index: 78, label: 'A — Form kosong (awal)', component: <Screen78CreateTripEmpty /> },
      { index: 12, label: 'A — Default terisi · waktu custom', component: <Screen12Create /> },
      { index: 67, label: 'A — Siap submit · sepanjang hari', component: <Screen67CreateTripFixedDate /> },
      { index: 68, label: 'A — Validasi error', component: <Screen68CreateTripFixedValidation /> },
      { index: 70, label: 'B — Mode kandidat · belum ada tersimpan', component: <Screen70CreateTripUncertainDate /> },
      { index: 71, label: 'B — Tooltip info tombol kandidat', component: <Screen71CreateTripUncertainInfo /> },
      { index: 57, label: 'B — Kandidat 1 aktif · belum simpan', component: <Screen57PickDateCandidate1 /> },
      { index: 80, label: 'B — Kandidat 1 tersimpan · tenggat muncul', component: <Screen80CreateTripCandidate1Saved /> },
      { index: 58, label: 'B — 1 tersimpan + kandidat 2 aktif', component: <Screen58PickDateCandidate2 /> },
      { index: 81, label: 'B — 2 kandidat tersimpan', component: <Screen81CreateTripTwoCandidatesSaved /> },
      { index: 13, label: 'B — 2 tersimpan + kandidat 3 aktif', component: <Screen13MultiDatePicker /> },
      { index: 59, label: 'B — 3 kandidat + tenggat · siap submit', component: <Screen59DateCandidatesComplete /> },
      { index: 14, label: 'B — Validasi error', component: <Screen14FormValidation /> },
      { index: 82, label: 'Submit — Loading', component: <Screen82CreateTripSubmitting /> },
      { index: 20, label: 'Undang — Sukses buat · search kosong', component: <Screen20BottomSheetUndang /> },
      { index: 43, label: 'Undang — Hasil cari', component: <Screen43InviteSearchResults /> },
      { index: 84, label: 'Undang — Hasil cari · sebagian terundang', component: <Screen84InvitePartialInvited /> },
      { index: 44, label: 'Undang — Tidak ditemukan', component: <Screen44InviteSearchEmpty /> },
      { index: 45, label: 'Undang — Daftar terundang', component: <Screen45InviteSent /> },
    ],
  },
  {
    id: 7,
    title: '7. Detail Perjalanan — Tab Itinerary',
    subtitle: 'Timeline · state waktu · tambah/edit aktivitas · cover · detail · menu ⋮ item',
    accent: C.coral,
    screens: [
      { index: 77, label: 'Itinerary — Empty', component: <Screen77ItineraryEmpty /> },
      { index: 15, label: 'Itinerary — Tanggal divoting · Hari 1 + gap', component: <Screen15Destinations /> },
      { index: 72, label: 'Itinerary — Multi-hari (state waktu)', component: <Screen72DestinationsFixedDate /> },
      { index: 18, label: 'Sheet — Tambah aktivitas (form awal)', component: <Screen18BottomSheetDestinasi /> },
      { index: 85, label: 'Sheet — Tambah (Maps + cover otomatis)', component: <Screen85ActivityAddLinked /> },
      { index: 89, label: 'Sheet — Tambah (Maps tanpa thumbnail)', component: <Screen89ActivityMapsNoThumb /> },
      { index: 91, label: 'Sheet — Tambah (cover media perjalanan)', component: <Screen91ActivityTripMediaCover /> },
      { index: 86, label: 'Sheet — Pilih cover · Media', component: <Screen86ActivityCoverPicker /> },
      { index: 90, label: 'Sheet — Pilih cover · Icon', component: <Screen90ActivityCoverIconPicker /> },
      { index: 19, label: 'Detail aktivitas (cover Maps)', component: <Screen19DestinationDetail /> },
      { index: 87, label: 'Detail aktivitas (cover icon)', component: <Screen87ActivityDetailNoCover /> },
      { index: 92, label: 'Detail aktivitas (tanpa cover)', component: <Screen92ActivityDetailBare /> },
      { index: 88, label: 'Sheet — Edit aktivitas', component: <Screen88ActivityEdit /> },
      { index: 93, label: 'Menu ⋮ aktivitas (Edit · Hapus)', component: <Screen93ActivityItemMenu /> },
    ],
  },
  {
    id: 8,
    title: '8. Detail Perjalanan — Tab Voting',
    subtitle: 'Aktif · empty · buat/edit · pipeline selesai · akhiri voting',
    accent: C.teal,
    screens: [
      { index: 16, label: 'Voting Aktif (tanggal + aktivitas)', component: <Screen16Voting /> },
      { index: 107, label: 'Voting — Empty', component: <Screen107VotingEmpty /> },
      { index: 60, label: 'Sheet — Buat voting tanggal baru', component: <Screen60CreateVotingTanggal /> },
      { index: 61, label: 'Sheet — Detail voting tanggal (awal)', component: <Screen61CreateVotingTanggalDetails /> },
      { index: 62, label: 'Sheet — Tambah kandidat 2', component: <Screen62CreateVotingTanggalPickCandidate /> },
      { index: 75, label: 'Sheet — Detail (2 kandidat + tenggat)', component: <Screen75VotingTanggalDetailsTwoCandidates /> },
      { index: 73, label: 'Sheet — Tambah kandidat 3', component: <Screen73VotingTanggalPickCandidate3 /> },
      { index: 74, label: 'Sheet — Detail lengkap + tenggat', component: <Screen74VotingTanggalDetailsComplete /> },
      { index: 42, label: 'Sheet — Buat Voting Aktivitas', component: <Screen42CreateVoting /> },
      { index: 53, label: 'Sheet — Detail Voting Aktivitas', component: <Screen53CreateVotingDetails /> },
      { index: 55, label: 'Sheet — Edit Voting', component: <Screen55EditVoting /> },
      { index: 54, label: 'Modal — Hapus Voting', component: <Screen54DeleteVotingModal /> },
      { index: 56, label: 'Menu ⋮ — Aktif (Edit/Akhiri/Hapus)', component: <Screen56VotingCardMenu /> },
      { index: 64, label: 'Voting — Pipeline + Selesai', component: <Screen64VotingEndedPipeline /> },
      { index: 65, label: 'Menu ⋮ — Selesai (Hapus saja)', component: <Screen65VotingEndedMenu /> },
      { index: 66, label: 'Voting — Auto Berakhir', component: <Screen66VotingExpired /> },
      { index: 21, label: 'Modal — Akhiri Voting Tanggal', component: <Screen21StatusLocked /> },
      { index: 48, label: 'Modal — Aktivitas Itinerary Selesai', component: <Screen48VotingLockedDestinasi /> },
      { index: 49, label: 'Modal — Voting Lainnya Selesai', component: <Screen49VotingLockedLainnya /> },
    ],
  },
  {
    id: 9,
    title: '9. Detail Perjalanan — Tab Chat',
    subtitle: 'Grup · lampiran · kirim media · empty · long press',
    accent: C.charcoal,
    screens: [
      { index: 17, label: 'Chat — Grup aktif', component: <Screen17Chat /> },
      { index: 97, label: 'Chat — Lampiran foto/video', component: <Screen97ChatAttachMenu /> },
      { index: 99, label: 'Chat — Kirim foto + caption', component: <Screen99ChatSendPhoto /> },
      { index: 101, label: 'Chat — Kirim foto (caption terisi)', component: <Screen101ChatSendPhotoCaption /> },
      { index: 100, label: 'Chat — Kirim video + caption', component: <Screen100ChatSendVideo /> },
      { index: 102, label: 'Chat — Kirim video (caption terisi)', component: <Screen102ChatSendVideoCaption /> },
      { index: 103, label: 'Chat — Foto terkirim (saya)', component: <Screen103ChatPhotoSent /> },
      { index: 104, label: 'Chat — Video terkirim (saya)', component: <Screen104ChatVideoSent /> },
      { index: 105, label: 'Chat — Foto dari anggota lain', component: <Screen105ChatPhotoReceived /> },
      { index: 106, label: 'Chat — Video dari anggota lain', component: <Screen106ChatVideoReceived /> },
      { index: 23, label: 'Chat — Empty', component: <Screen23EmptyChat /> },
      { index: 24, label: 'Chat — Long press menu', component: <Screen24ChatLongPress /> },
    ],
  },
  {
    id: 10,
    title: '10. Detail Perjalanan — Tab Media',
    subtitle: 'Grid media perjalanan · unggah · set cover · dari chat',
    accent: C.coral,
    screens: [
      { index: 41, label: 'Tab — Media & Cover', component: <Screen41TripDocuments /> },
      { index: 98, label: 'Tab — Media (+ dari chat)', component: <Screen98MediaFromChat /> },
    ],
  },
  {
    id: 11,
    title: '11. Detail Perjalanan — Kelola Trip',
    subtitle: 'Menu ⋮ header — anggota · edit info · hapus · sinkron kalender',
    accent: C.teal,
    screens: [
      { index: 52, label: 'Modal — Hapus Perjalanan', component: <Screen52TripDelete /> },
      { index: 22, label: 'Modal — Google Calendar', component: <Screen22CalendarSyncModal /> },
      { index: 50, label: 'Daftar Anggota', component: <Screen50TripMembers /> },
      { index: 51, label: 'Edit Info Perjalanan', component: <Screen51TripEdit /> },
    ],
  },
  {
    id: 12,
    title: '12. Wishlist — Tab 4',
    subtitle: 'Grid · Tambah/edit · Jadikan Perjalanan · Semua state untuk slicing',
    accent: C.coral,
    screens: [
      { index: 108, label: 'Empty — Belum ada item', component: <Screen108WishlistEmpty /> },
      { index: 25, label: 'Grid — Daftar terisi', component: <Screen25Wishlist /> },
      { index: 110, label: 'Filter — Tidak ada hasil', component: <Screen110WishlistFilterEmpty /> },
      { index: 111, label: 'Sheet — Tambah (form kosong)', component: <Screen111AddWishlistEmpty /> },
      { index: 26, label: 'Sheet — Tambah (form terisi)', component: <Screen26BottomSheetWishlist /> },
      { index: 112, label: 'Sheet — Tambah (validasi error)', component: <Screen112AddWishlistValidation /> },
      { index: 113, label: 'Detail item', component: <Screen113WishlistDetail /> },
      { index: 114, label: 'Sheet — Edit item', component: <Screen114EditWishlist /> },
      { index: 115, label: 'Menu ⋮ (Edit · Hapus · Jadikan Perjalanan)', component: <Screen115WishlistCardMenu /> },
      { index: 116, label: 'Modal — Hapus item', component: <Screen116WishlistDelete /> },
      { index: 117, label: 'Jadikan Perjalanan — Prefill wishlist', component: <Screen117WishlistToTripEmpty /> },
      { index: 118, label: 'Jadikan Perjalanan — Siap submit', component: <Screen118WishlistToTripReady /> },
      { index: 119, label: 'Undang — Sukses buat (+ wishlist dihapus)', component: <Screen119WishlistToTripInvite /> },
      { index: 120, label: 'Itinerary — 1 aktivitas dari wishlist', component: <Screen120ItineraryFromWishlist /> },
    ],
  },
  {
    id: 13,
    title: '13. System States & Micro-interactions',
    subtitle: 'Loading · Toast · Error · Media viewer · Dark mode · Design tokens',
    accent: C.coral,
    screens: [
      { index: 28, label: 'Skeleton Loading', component: <Screen28SkeletonLoading /> },
      { index: 29, label: 'Toast & Snackbar', component: <Screen29ToastComponents /> },
      { index: 30, label: 'Error — Offline', component: <Screen30Error /> },
      { index: 94, label: 'Media Viewer — Foto', component: <Screen94MediaViewerPhoto /> },
      { index: 95, label: 'Media Viewer — Video (pause)', component: <Screen95MediaViewerVideo /> },
      { index: 96, label: 'Media Viewer — Video (playing)', component: <Screen96MediaViewerVideoPlaying /> },
      { index: 31, label: 'Dark Mode — Beranda', component: <Screen31DarkBeranda /> },
      { index: 32, label: 'Design Tokens', component: <Screen32DesignTokens /> },
    ],
  },
];

const TOTAL_SCREENS = workflowSections.reduce((sum, s) => sum + s.screens.length, 0);

function ScreenRow({ sectionId, screens }: { sectionId: number; screens: WorkflowSection['screens'] }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 36,
        overflowX: 'auto',
        alignItems: 'flex-start',
        scrollbarWidth: 'none',
        paddingBottom: 4,
      }}
    >
      {screens.map((screen) => (
        <PhoneFrame key={`${sectionId}-${screen.index}`} index={screen.index} label={screen.label}>
          {screen.component}
        </PhoneFrame>
      ))}
    </div>
  );
}

function SectionLabel({
  title,
  subtitle,
  accent = C.coral,
}: {
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: 24, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 20, backgroundColor: accent, borderRadius: 4 }} />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 13, color: C.muted, margin: '5px 0 0 14px', fontWeight: 500 }}>{subtitle}</p>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #F5F0EB 0%, #EDE6DB 40%, #E6DECE 100%)',
        fontFamily: FONT,
      }}
    >
      {/* ── Page header ── */}
      <div style={{ padding: '52px 60px 44px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: C.coral,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${C.coral}66`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" stroke="none" />
            </svg>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.8 }}>
            Atur Perjalanan
          </h1>
        </div>

        <p style={{ color: C.muted, fontSize: 15, margin: '0 0 22px', fontWeight: 500 }}>
          Mobile App UI · {TOTAL_SCREENS} Layar High-Fidelity · Dikelompokkan per pipeline docs/WORKFLOW.md
        </p>

        {/* Palette swatches */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[
            { color: C.white, label: 'Canvas', border: `1px solid ${C.border}` },
            { color: C.charcoal, label: 'Charcoal' },
            { color: C.coral, label: 'Warm Coral' },
            { color: C.teal, label: 'Soft Teal' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 20, height: 20, backgroundColor: s.color, borderRadius: 6, border: s.border ?? 'none', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {workflowSections.map((section, i) => (
        <div key={section.id}>
          <div style={{ padding: '0 60px 16px' }}>
            <SectionLabel title={section.title} subtitle={section.subtitle} accent={section.accent} />
          </div>
          <div style={{ padding: `0 60px ${i === workflowSections.length - 1 ? 80 : 60}px` }}>
            <ScreenRow sectionId={section.id} screens={section.screens} />
          </div>
        </div>
      ))}
    </div>
  );
}
