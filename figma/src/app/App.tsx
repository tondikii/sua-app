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
import { Screen7HomeSelesai } from './components/screens/Screen7HomeSelesai';
import { Screen8HomeUndangan } from './components/screens/Screen8HomeUndangan';
import { Screen9Notifikasi } from './components/screens/Screen9Notifikasi';

// §4 Pencarian
import { Screen10SearchIdle } from './components/screens/Screen10SearchIdle';
import { Screen11SearchUser } from './components/screens/Screen11SearchUser';
import { Screen12SearchNoResults } from './components/screens/Screen12SearchNoResults';
import { Screen13PublicProfile } from './components/screens/Screen13PublicProfile';
import { Screen14PublicProfileEmptyTrip } from './components/screens/Screen14PublicProfileEmptyTrip';

// §5 Profil
import { Screen15Profile } from './components/screens/Screen15Profile';
import { Screen16ProfileEmptyTrip } from './components/screens/Screen16ProfileEmptyTrip';
import { Screen18EditProfil } from './components/screens/Screen18EditProfil';
import { Screen17Settings } from './components/screens/Screen17Settings';
import { Screen19SettingsHelpFaq } from './components/screens/Screen19SettingsHelpFaq';
import { Screen20SettingsDeleteAccount } from './components/screens/Screen20SettingsDeleteAccount';

// §6 Pembuatan Perjalanan
import { Screen22Create } from './components/screens/Screen22Create';
import { Screen31MultiDatePicker } from './components/screens/Screen31MultiDatePicker';
import { Screen33FormValidation } from './components/screens/Screen33FormValidation';
import { Screen27PickDateCandidate1 } from './components/screens/Screen27PickDateCandidate1';
import { Screen29PickDateCandidate2 } from './components/screens/Screen29PickDateCandidate2';
import { Screen32DateCandidatesComplete } from './components/screens/Screen32DateCandidatesComplete';
import { Screen23CreateTripFixedDate } from './components/screens/Screen23CreateTripFixedDate';
import { Screen24CreateTripFixedValidation } from './components/screens/Screen24CreateTripFixedValidation';
import { Screen25CreateTripUncertainDate } from './components/screens/Screen25CreateTripUncertainDate';
import { Screen26CreateTripUncertainInfo } from './components/screens/Screen26CreateTripUncertainInfo';
import { Screen21CreateTripEmpty } from './components/screens/Screen21CreateTripEmpty';
import { Screen28CreateTripCandidate1Saved } from './components/screens/Screen28CreateTripCandidate1Saved';
import { Screen30CreateTripTwoCandidatesSaved } from './components/screens/Screen30CreateTripTwoCandidatesSaved';
import { Screen34CreateTripSubmitting } from './components/screens/Screen34CreateTripSubmitting';
import { Screen37InvitePartialInvited } from './components/screens/Screen37InvitePartialInvited';
import { Screen35BottomSheetUndang } from './components/screens/Screen35BottomSheetUndang';
import { Screen36InviteSearchResults } from './components/screens/Screen36InviteSearchResults';
import { Screen38InviteSearchEmpty } from './components/screens/Screen38InviteSearchEmpty';
import { Screen41InviteSent } from './components/screens/Screen41InviteSent';
import { Screen39InviteEmailNotRegistered } from './components/screens/Screen39InviteEmailNotRegistered';
import { Screen40InviteEmailSent } from './components/screens/Screen40InviteEmailSent';

// §7 Detail Perjalanan — Itinerary
import { Screen43Destinations } from './components/screens/Screen43Destinations';
import { Screen44DestinationsFixedDate } from './components/screens/Screen44DestinationsFixedDate';
import { Screen42ItineraryEmpty } from './components/screens/Screen42ItineraryEmpty';
import { Screen45BottomSheetDestinasi } from './components/screens/Screen45BottomSheetDestinasi';
import { Screen51DestinationDetail } from './components/screens/Screen51DestinationDetail';
import { Screen46ActivityAddLinked } from './components/screens/Screen46ActivityAddLinked';
import { Screen49ActivityCoverPicker } from './components/screens/Screen49ActivityCoverPicker';
import { Screen52ActivityDetailNoCover } from './components/screens/Screen52ActivityDetailNoCover';
import { Screen54ActivityEdit } from './components/screens/Screen54ActivityEdit';
import { Screen47ActivityMapsNoThumb } from './components/screens/Screen47ActivityMapsNoThumb';
import { Screen50ActivityCoverIconPicker } from './components/screens/Screen50ActivityCoverIconPicker';
import { Screen48ActivityTripMediaCover } from './components/screens/Screen48ActivityTripMediaCover';
import { Screen53ActivityDetailBare } from './components/screens/Screen53ActivityDetailBare';
import { Screen55ActivityItemMenu } from './components/screens/Screen55ActivityItemMenu';

// §8 Detail Perjalanan — Voting
import { Screen56Voting } from './components/screens/Screen56Voting';
import { Screen57VotingEmpty } from './components/screens/Screen57VotingEmpty';
import { Screen64CreateVoting } from './components/screens/Screen64CreateVoting';
import { Screen65CreateVotingDetails } from './components/screens/Screen65CreateVotingDetails';
import { Screen68DeleteVotingModal } from './components/screens/Screen68DeleteVotingModal';
import { Screen66EditVoting } from './components/screens/Screen66EditVoting';
import { Screen69VotingCardMenu } from './components/screens/Screen69VotingCardMenu';
import { Screen58CreateVotingTanggal } from './components/screens/Screen58CreateVotingTanggal';
import { Screen59CreateVotingTanggalDetails } from './components/screens/Screen59CreateVotingTanggalDetails';
import { Screen60CreateVotingTanggalPickCandidate } from './components/screens/Screen60CreateVotingTanggalPickCandidate';
import { Screen62VotingTanggalPickCandidate3 } from './components/screens/Screen62VotingTanggalPickCandidate3';
import { Screen63VotingTanggalDetailsComplete } from './components/screens/Screen63VotingTanggalDetailsComplete';
import { Screen61VotingTanggalDetailsTwoCandidates } from './components/screens/Screen61VotingTanggalDetailsTwoCandidates';
import { Screen67EditVotingTanggal } from './components/screens/Screen67EditVotingTanggal';
import { Screen70VotingEndedPipeline } from './components/screens/Screen70VotingEndedPipeline';
import { Screen71VotingEndedMenu } from './components/screens/Screen71VotingEndedMenu';
import { Screen72VotingExpired } from './components/screens/Screen72VotingExpired';
import { Screen73StatusLocked } from './components/screens/Screen73StatusLocked';
import { Screen74VotingLockedDestinasi } from './components/screens/Screen74VotingLockedDestinasi';
import { Screen75VotingLockedLainnya } from './components/screens/Screen75VotingLockedLainnya';

// §9 Detail Perjalanan — Chat
import { Screen76Chat } from './components/screens/Screen76Chat';
import { Screen86EmptyChat } from './components/screens/Screen86EmptyChat';
import { Screen87ChatLongPress, Screen88ChatLongPressOwn } from './components/screens/Screen87ChatLongPress';
import {
  Screen89ChatReplyMeToOther,
  Screen90ChatReplyMeToSelf,
  Screen91ChatReplyOtherToOther,
  Screen92ChatReplyOtherToMe,
} from './components/screens/Screen89ChatReplyMeToOther';
import { Screen77ChatAttachMenu } from './components/screens/Screen77ChatAttachMenu';
import {
  Screen78ChatSendPhoto,
  Screen80ChatSendVideo,
  Screen79ChatSendPhotoCaption,
  Screen81ChatSendVideoCaption,
} from './components/screens/Screen78ChatSendPhoto';
import { Screen82ChatPhotoSent } from './components/screens/Screen82ChatPhotoSent';
import { Screen83ChatVideoSent } from './components/screens/Screen83ChatVideoSent';
import { Screen84ChatPhotoReceived } from './components/screens/Screen84ChatPhotoReceived';
import { Screen85ChatVideoReceived } from './components/screens/Screen85ChatVideoReceived';

// §10 Detail Perjalanan — Media
import { Screen93TripDocuments } from './components/screens/Screen93TripDocuments';
import { Screen94MediaFromChat } from './components/screens/Screen94MediaFromChat';

// §11 Detail Perjalanan — Kelola Trip
import { Screen97TripMembers } from './components/screens/Screen97TripMembers';
import { Screen98TripMembersInviteEmail } from './components/screens/Screen98TripMembersInviteEmail';
import { Screen99TripMembersEmailInvited } from './components/screens/Screen99TripMembersEmailInvited';
import { Screen100TripMembersPendingInvite } from './components/screens/Screen100TripMembersPendingInvite';
import { Screen102TripMembersAsMember } from './components/screens/Screen102TripMembersAsMember';
import { Screen101TripMembersRejected } from './components/screens/Screen101TripMembersRejected';
import { Screen96CalendarSyncModal } from './components/screens/Screen96CalendarSyncModal';
import { Screen103TripEdit } from './components/screens/Screen103TripEdit';
import { Screen95TripDelete } from './components/screens/Screen95TripDelete';

// §12 Wishlist
import { Screen105Wishlist } from './components/screens/Screen105Wishlist';
import { Screen108BottomSheetWishlist } from './components/screens/Screen108BottomSheetWishlist';
import { Screen104WishlistEmpty } from './components/screens/Screen104WishlistEmpty';
import { Screen106WishlistFilterEmpty } from './components/screens/Screen106WishlistFilterEmpty';
import { Screen107AddWishlistEmpty } from './components/screens/Screen107AddWishlistEmpty';
import { Screen109AddWishlistValidation } from './components/screens/Screen109AddWishlistValidation';
import { Screen110WishlistDetail } from './components/screens/Screen110WishlistDetail';
import { Screen111EditWishlist } from './components/screens/Screen111EditWishlist';
import { Screen112WishlistCardMenu } from './components/screens/Screen112WishlistCardMenu';
import { Screen113WishlistDelete } from './components/screens/Screen113WishlistDelete';
import { Screen114WishlistToTripEmpty } from './components/screens/Screen114WishlistToTripEmpty';
import { Screen115WishlistToTripReady } from './components/screens/Screen115WishlistToTripReady';
import { Screen116WishlistToTripInvite } from './components/screens/Screen116WishlistToTripInvite';
import { Screen117ItineraryFromWishlist } from './components/screens/Screen117ItineraryFromWishlist';

// §13 System States & Micro-interactions
import { Screen118SkeletonLoading } from './components/screens/Screen118SkeletonLoading';
import { Screen119ToastComponents } from './components/screens/Screen119ToastComponents';
import { Screen120Error } from './components/screens/Screen120Error';
import { Screen124DarkBeranda } from './components/screens/Screen124DarkBeranda';
import { Screen125DesignTokens } from './components/screens/Screen125DesignTokens';
import { Screen121MediaViewerPhoto } from './components/screens/Screen121MediaViewerPhoto';
import { Screen122MediaViewerVideo } from './components/screens/Screen122MediaViewerVideo';
import { Screen123MediaViewerVideoPlaying } from './components/screens/Screen123MediaViewerVideoPlaying';

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
      { index: 7, label: 'Beranda — Selesai', component: <Screen7HomeSelesai /> },
      { index: 8, label: 'Beranda — Undangan', component: <Screen8HomeUndangan /> },
      { index: 9, label: 'Notifikasi', component: <Screen9Notifikasi /> },
    ],
  },
  {
    id: 4,
    title: '4. Pencarian (Cari) — Tab 2',
    subtitle: 'Idle · Hasil · Kosong · Profil publik (dari hasil cari)',
    accent: C.teal,
    screens: [
      { index: 10, label: 'Cari — Idle', component: <Screen10SearchIdle /> },
      { index: 11, label: 'Cari — Hasil', component: <Screen11SearchUser /> },
      { index: 12, label: 'Cari — Tidak Ada Hasil', component: <Screen12SearchNoResults /> },
      { index: 13, label: 'Profil Publik', component: <Screen13PublicProfile /> },
      { index: 14, label: 'Profil Publik — Empty Trip', component: <Screen14PublicProfileEmptyTrip /> },
    ],
  },
  {
    id: 5,
    title: '5. Profil — Tab 5',
    subtitle: 'Profil pribadi · Empty trip · Pengaturan · Edit · Bantuan · Hapus akun',
    accent: C.coral,
    screens: [
      { index: 15, label: 'Profil & Eksplorasi', component: <Screen15Profile /> },
      { index: 16, label: 'Profil — Empty Trip', component: <Screen16ProfileEmptyTrip /> },
      { index: 17, label: 'Pengaturan', component: <Screen17Settings /> },
      { index: 18, label: 'Edit Profil', component: <Screen18EditProfil /> },
      { index: 19, label: 'Bantuan & FAQ', component: <Screen19SettingsHelpFaq /> },
      { index: 20, label: 'Hapus Akun', component: <Screen20SettingsDeleteAccount /> },
    ],
  },
  {
    id: 6,
    title: '6. Pembuatan Perjalanan — Tab [+]',
    subtitle: 'A: Tanggal pasti · B: Kandidat tanggal · Undang · Semua state untuk slicing',
    accent: C.teal,
    screens: [
      { index: 21, label: 'A — Form kosong (awal)', component: <Screen21CreateTripEmpty /> },
      { index: 22, label: 'A — Default terisi · waktu custom', component: <Screen22Create /> },
      { index: 23, label: 'A — Siap submit · sepanjang hari', component: <Screen23CreateTripFixedDate /> },
      { index: 24, label: 'A — Validasi error', component: <Screen24CreateTripFixedValidation /> },
      { index: 25, label: 'B — Mode kandidat · belum ada tersimpan', component: <Screen25CreateTripUncertainDate /> },
      { index: 26, label: 'B — Tooltip info tombol kandidat', component: <Screen26CreateTripUncertainInfo /> },
      { index: 27, label: 'B — Kandidat 1 aktif · belum simpan', component: <Screen27PickDateCandidate1 /> },
      { index: 28, label: 'B — Kandidat 1 tersimpan · tenggat muncul', component: <Screen28CreateTripCandidate1Saved /> },
      { index: 29, label: 'B — 1 tersimpan + kandidat 2 aktif', component: <Screen29PickDateCandidate2 /> },
      { index: 30, label: 'B — 2 kandidat tersimpan', component: <Screen30CreateTripTwoCandidatesSaved /> },
      { index: 31, label: 'B — 2 tersimpan + kandidat 3 aktif', component: <Screen31MultiDatePicker /> },
      { index: 32, label: 'B — 3 kandidat + tenggat · siap submit', component: <Screen32DateCandidatesComplete /> },
      { index: 33, label: 'B — Validasi error', component: <Screen33FormValidation /> },
      { index: 34, label: 'Submit — Loading', component: <Screen34CreateTripSubmitting /> },
      { index: 35, label: 'Undang — Sukses buat · search kosong', component: <Screen35BottomSheetUndang /> },
      { index: 36, label: 'Undang — Hasil cari', component: <Screen36InviteSearchResults /> },
      { index: 37, label: 'Undang — Hasil cari · sebagian terundang', component: <Screen37InvitePartialInvited /> },
      { index: 38, label: 'Undang — Tidak ditemukan', component: <Screen38InviteSearchEmpty /> },
      { index: 39, label: 'Undang — Email belum terdaftar', component: <Screen39InviteEmailNotRegistered /> },
      { index: 40, label: 'Undang — Email terkirim', component: <Screen40InviteEmailSent /> },
      { index: 41, label: 'Undang — Daftar terundang', component: <Screen41InviteSent /> },
    ],
  },
  {
    id: 7,
    title: '7. Detail Perjalanan — Tab Itinerary',
    subtitle: 'Timeline · state waktu · tambah/edit aktivitas · cover · detail · menu ⋮ item',
    accent: C.coral,
    screens: [
      { index: 42, label: 'Itinerary — Empty', component: <Screen42ItineraryEmpty /> },
      { index: 43, label: 'Itinerary — Tanggal divoting · Hari 1 + gap', component: <Screen43Destinations /> },
      { index: 44, label: 'Itinerary — Multi-hari (state waktu)', component: <Screen44DestinationsFixedDate /> },
      { index: 45, label: 'Sheet — Tambah aktivitas (form awal)', component: <Screen45BottomSheetDestinasi /> },
      { index: 46, label: 'Sheet — Tambah (Maps + cover otomatis)', component: <Screen46ActivityAddLinked /> },
      { index: 47, label: 'Sheet — Tambah (Maps tanpa thumbnail)', component: <Screen47ActivityMapsNoThumb /> },
      { index: 48, label: 'Sheet — Tambah (cover media perjalanan)', component: <Screen48ActivityTripMediaCover /> },
      { index: 49, label: 'Sheet — Pilih cover · Media', component: <Screen49ActivityCoverPicker /> },
      { index: 50, label: 'Sheet — Pilih cover · Icon', component: <Screen50ActivityCoverIconPicker /> },
      { index: 51, label: 'Detail aktivitas (cover Maps)', component: <Screen51DestinationDetail /> },
      { index: 52, label: 'Detail aktivitas (cover icon)', component: <Screen52ActivityDetailNoCover /> },
      { index: 53, label: 'Detail aktivitas (tanpa cover)', component: <Screen53ActivityDetailBare /> },
      { index: 54, label: 'Sheet — Edit aktivitas', component: <Screen54ActivityEdit /> },
      { index: 55, label: 'Menu ⋮ aktivitas (Edit · Hapus)', component: <Screen55ActivityItemMenu /> },
    ],
  },
  {
    id: 8,
    title: '8. Detail Perjalanan — Tab Voting',
    subtitle: 'Aktif · empty · buat/edit · pipeline selesai · akhiri voting',
    accent: C.teal,
    screens: [
      { index: 56, label: 'Voting Aktif (tanggal + aktivitas)', component: <Screen56Voting /> },
      { index: 57, label: 'Voting — Empty', component: <Screen57VotingEmpty /> },
      { index: 58, label: 'Sheet — Buat voting baru (tanggal)', component: <Screen58CreateVotingTanggal /> },
      { index: 59, label: 'Sheet — Detail Voting (tanggal · awal)', component: <Screen59CreateVotingTanggalDetails /> },
      { index: 60, label: 'Sheet — Tambah Kandidat Tanggal (kandidat 2)', component: <Screen60CreateVotingTanggalPickCandidate /> },
      { index: 61, label: 'Sheet — Detail Voting (2 kandidat)', component: <Screen61VotingTanggalDetailsTwoCandidates /> },
      { index: 62, label: 'Sheet — Tambah Kandidat Tanggal (kandidat 3)', component: <Screen62VotingTanggalPickCandidate3 /> },
      { index: 63, label: 'Sheet — Detail Voting (lengkap)', component: <Screen63VotingTanggalDetailsComplete /> },
      { index: 64, label: 'Sheet — Buat Voting (pilih jenis)', component: <Screen64CreateVoting /> },
      { index: 65, label: 'Sheet — Detail Voting (aktivitas)', component: <Screen65CreateVotingDetails /> },
      { index: 66, label: 'Sheet — Edit Voting (aktivitas)', component: <Screen66EditVoting /> },
      { index: 67, label: 'Sheet — Edit Voting (tanggal)', component: <Screen67EditVotingTanggal /> },
      { index: 68, label: 'Modal — Hapus Voting', component: <Screen68DeleteVotingModal /> },
      { index: 69, label: 'Menu ⋮ — Aktif (Edit/Akhiri/Hapus)', component: <Screen69VotingCardMenu /> },
      { index: 70, label: 'Voting — Pipeline + Selesai', component: <Screen70VotingEndedPipeline /> },
      { index: 71, label: 'Menu ⋮ — Selesai (Hapus saja)', component: <Screen71VotingEndedMenu /> },
      { index: 72, label: 'Voting — Auto Berakhir', component: <Screen72VotingExpired /> },
      { index: 73, label: 'Modal — Akhiri Voting Tanggal', component: <Screen73StatusLocked /> },
      { index: 74, label: 'Modal — Aktivitas Itinerary Selesai', component: <Screen74VotingLockedDestinasi /> },
      { index: 75, label: 'Modal — Voting Lainnya Selesai', component: <Screen75VotingLockedLainnya /> },
    ],
  },
  {
    id: 9,
    title: '9. Detail Perjalanan — Tab Chat',
    subtitle: 'Grup · lampiran · kirim media · empty · long press',
    accent: C.charcoal,
    screens: [
      { index: 76, label: 'Chat — Grup aktif', component: <Screen76Chat /> },
      { index: 77, label: 'Chat — Lampiran foto/video', component: <Screen77ChatAttachMenu /> },
      { index: 78, label: 'Chat — Kirim foto + caption', component: <Screen78ChatSendPhoto /> },
      { index: 79, label: 'Chat — Kirim foto (caption terisi)', component: <Screen79ChatSendPhotoCaption /> },
      { index: 80, label: 'Chat — Kirim video + caption', component: <Screen80ChatSendVideo /> },
      { index: 81, label: 'Chat — Kirim video (caption terisi)', component: <Screen81ChatSendVideoCaption /> },
      { index: 82, label: 'Chat — Foto terkirim (saya)', component: <Screen82ChatPhotoSent /> },
      { index: 83, label: 'Chat — Video terkirim (saya)', component: <Screen83ChatVideoSent /> },
      { index: 84, label: 'Chat — Foto dari anggota lain', component: <Screen84ChatPhotoReceived /> },
      { index: 85, label: 'Chat — Video dari anggota lain', component: <Screen85ChatVideoReceived /> },
      { index: 86, label: 'Chat — Empty', component: <Screen86EmptyChat /> },
      { index: 87, label: 'Chat — Long press (pesan orang lain)', component: <Screen87ChatLongPress /> },
      { index: 88, label: 'Chat — Long press (pesan sendiri)', component: <Screen88ChatLongPressOwn /> },
      { index: 89, label: 'Chat — Balas (saya → orang lain)', component: <Screen89ChatReplyMeToOther /> },
      { index: 90, label: 'Chat — Balas (saya → saya)', component: <Screen90ChatReplyMeToSelf /> },
      { index: 91, label: 'Chat — Balas (orang lain → orang lain)', component: <Screen91ChatReplyOtherToOther /> },
      { index: 92, label: 'Chat — Balas (orang lain → saya)', component: <Screen92ChatReplyOtherToMe /> },
    ],
  },
  {
    id: 10,
    title: '10. Detail Perjalanan — Tab Media',
    subtitle: 'Grid media perjalanan · unggah · set cover · dari chat',
    accent: C.coral,
    screens: [
      { index: 93, label: 'Tab — Media & Cover', component: <Screen93TripDocuments /> },
      { index: 94, label: 'Tab — Media (+ dari chat)', component: <Screen94MediaFromChat /> },
    ],
  },
  {
    id: 11,
    title: '11. Detail Perjalanan — Kelola Trip',
    subtitle: 'Menu ⋮ header — anggota · edit info · hapus · sinkron kalender',
    accent: C.teal,
    screens: [
      { index: 95, label: 'Modal — Hapus Perjalanan', component: <Screen95TripDelete /> },
      { index: 96, label: 'Modal — Google Calendar', component: <Screen96CalendarSyncModal /> },
      { index: 97, label: 'Anggota — Pembuat', component: <Screen97TripMembers /> },
      { index: 98, label: 'Anggota — Cari email belum terdaftar', component: <Screen98TripMembersInviteEmail /> },
      { index: 99, label: 'Anggota — Pending · belum daftar app', component: <Screen99TripMembersEmailInvited /> },
      { index: 100, label: 'Anggota — Pending · 2 state', component: <Screen100TripMembersPendingInvite /> },
      { index: 101, label: 'Anggota — Ditolak · undang kembali', component: <Screen101TripMembersRejected /> },
      { index: 102, label: 'Anggota — POV anggota', component: <Screen102TripMembersAsMember /> },
      { index: 103, label: 'Edit Info Perjalanan', component: <Screen103TripEdit /> },
    ],
  },
  {
    id: 12,
    title: '12. Wishlist — Tab 4',
    subtitle: 'Grid · Tambah/edit · Jadikan Perjalanan · Semua state untuk slicing',
    accent: C.coral,
    screens: [
      { index: 104, label: 'Empty — Belum ada item', component: <Screen104WishlistEmpty /> },
      { index: 105, label: 'Grid — Daftar terisi', component: <Screen105Wishlist /> },
      { index: 106, label: 'Filter — Tidak ada hasil', component: <Screen106WishlistFilterEmpty /> },
      { index: 107, label: 'Sheet — Tambah (form kosong)', component: <Screen107AddWishlistEmpty /> },
      { index: 108, label: 'Sheet — Tambah (form terisi)', component: <Screen108BottomSheetWishlist /> },
      { index: 109, label: 'Sheet — Tambah (validasi error)', component: <Screen109AddWishlistValidation /> },
      { index: 110, label: 'Detail item', component: <Screen110WishlistDetail /> },
      { index: 111, label: 'Sheet — Edit item', component: <Screen111EditWishlist /> },
      { index: 112, label: 'Menu ⋮ (Edit · Hapus · Jadikan Perjalanan)', component: <Screen112WishlistCardMenu /> },
      { index: 113, label: 'Modal — Hapus item', component: <Screen113WishlistDelete /> },
      { index: 114, label: 'Jadikan Perjalanan — Prefill wishlist', component: <Screen114WishlistToTripEmpty /> },
      { index: 115, label: 'Jadikan Perjalanan — Siap submit', component: <Screen115WishlistToTripReady /> },
      { index: 116, label: 'Undang — Sukses buat (+ wishlist dihapus)', component: <Screen116WishlistToTripInvite /> },
      { index: 117, label: 'Itinerary — 1 aktivitas dari wishlist', component: <Screen117ItineraryFromWishlist /> },
    ],
  },
  {
    id: 13,
    title: '13. System States & Micro-interactions',
    subtitle: 'Loading · Toast · Error · Media viewer · Dark mode · Design tokens',
    accent: C.coral,
    screens: [
      { index: 118, label: 'Skeleton Loading', component: <Screen118SkeletonLoading /> },
      { index: 119, label: 'Toast & Snackbar', component: <Screen119ToastComponents /> },
      { index: 120, label: 'Error — Offline', component: <Screen120Error /> },
      { index: 121, label: 'Media Viewer — Foto', component: <Screen121MediaViewerPhoto /> },
      { index: 122, label: 'Media Viewer — Video (pause)', component: <Screen122MediaViewerVideo /> },
      { index: 123, label: 'Media Viewer — Video (playing)', component: <Screen123MediaViewerVideoPlaying /> },
      { index: 124, label: 'Dark Mode — Beranda', component: <Screen124DarkBeranda /> },
      { index: 125, label: 'Design Tokens', component: <Screen125DesignTokens /> },
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
