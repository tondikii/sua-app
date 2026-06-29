import type { ReactElement } from 'react';
import '../styles/index.css';
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

// §4 Pencarian & Profil
import { Screen35SearchIdle } from './components/screens/Screen35SearchIdle';
import { Screen7SearchUser } from './components/screens/Screen7SearchUser';
import { Screen8Profile } from './components/screens/Screen8Profile';
import { Screen9EditProfil } from './components/screens/Screen9EditProfil';
import { Screen10PublicProfile } from './components/screens/Screen10PublicProfile';
import { Screen36ProfileEmptyTrip } from './components/screens/Screen36ProfileEmptyTrip';
import { Screen37PublicProfileEmptyTrip } from './components/screens/Screen37PublicProfileEmptyTrip';
import { Screen11Settings } from './components/screens/Screen11Settings';
import { Screen38SettingsDeleteAccount } from './components/screens/Screen38SettingsDeleteAccount';
import { Screen39SettingsHelpFaq } from './components/screens/Screen39SettingsHelpFaq';

// §5 Pembuatan Perjalanan
import { Screen12Create } from './components/screens/Screen12Create';
import { Screen13MultiDatePicker } from './components/screens/Screen13MultiDatePicker';
import { Screen14FormValidation } from './components/screens/Screen14FormValidation';

// §6 Detail Perjalanan
import { Screen15Destinations } from './components/screens/Screen15Destinations';
import { Screen16Voting } from './components/screens/Screen16Voting';
import { Screen17Chat } from './components/screens/Screen17Chat';
import { Screen18BottomSheetDestinasi } from './components/screens/Screen18BottomSheetDestinasi';
import { Screen19DestinationDetail } from './components/screens/Screen19DestinationDetail';

// §7 Mengundang Partisipan
import { Screen20BottomSheetUndang } from './components/screens/Screen20BottomSheetUndang';

// §8 Voting Tanggal
import { Screen21StatusLocked } from './components/screens/Screen21StatusLocked';
import { Screen22CalendarSyncModal } from './components/screens/Screen22CalendarSyncModal';

// §9 Grup Chat
import { Screen23EmptyChat } from './components/screens/Screen23EmptyChat';
import { Screen24ChatLongPress } from './components/screens/Screen24ChatLongPress';

// §10 Wishlist
import { Screen25Wishlist } from './components/screens/Screen25Wishlist';
import { Screen26BottomSheetWishlist } from './components/screens/Screen26BottomSheetWishlist';

// §11 Notifikasi
import { Screen27Notifikasi } from './components/screens/Screen27Notifikasi';

// §13 System States & Micro-interactions (§12 Pengaturan → Screen11 di §4)
import { Screen28SkeletonLoading } from './components/screens/Screen28SkeletonLoading';
import { Screen29ToastComponents } from './components/screens/Screen29ToastComponents';
import { Screen30Error } from './components/screens/Screen30Error';
import { Screen31DarkBeranda } from './components/screens/Screen31DarkBeranda';
import { Screen32DesignTokens } from './components/screens/Screen32DesignTokens';

const FONT = "'Plus Jakarta Sans', -apple-system, sans-serif";

type WorkflowSection = {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  screens: { index: number; label: string; component: ReactElement }[];
};

/** Pengelompokan selaras dengan docs/WORKFLOW.md §1–§13 · nomor layar 1–39 mengikuti urutan section */
const workflowSections: WorkflowSection[] = [
  {
    id: 1,
    title: '1. Onboarding Layar Awal',
    subtitle: 'Splash · Carousel 4 slide (pengenalan → masalah & solusi per BRIEF)',
    accent: '#FF6B6B',
    screens: [
      { index: 1, label: 'Splash Screen', component: <Screen1Splash /> },
      { index: 2, label: 'Edu Onboarding', component: <Screen2EduOnboarding /> },
    ],
  },
  {
    id: 2,
    title: '2. Autentikasi (Google Sign-In)',
    subtitle: 'Lanjutkan dengan Google · Buat username unik (pengguna baru)',
    accent: '#4ECDC4',
    screens: [
      { index: 3, label: 'Auth & Onboarding', component: <Screen3Auth /> },
      { index: 4, label: 'Buat Username', component: <Screen4Username /> },
    ],
  },
  {
    id: 3,
    title: '3. Beranda (Home) — Tab 1',
    subtitle: 'Tab Mendatang · Selesai · Undangan · Empty state · Counter tab & notifikasi',
    accent: '#FF6B6B',
    screens: [
      { index: 5, label: 'Beranda — Mendatang', component: <Screen5Home /> },
      { index: 6, label: 'Empty — Beranda', component: <Screen6EmptyBeranda /> },
      { index: 33, label: 'Beranda — Selesai', component: <Screen33HomeSelesai /> },
      { index: 34, label: 'Beranda — Undangan', component: <Screen34HomeUndangan /> },
    ],
  },
  {
    id: 4,
    title: '4. Pencarian & Profil — Tab 2 & 5',
    subtitle: 'Cari (idle & hasil) · Profil publik · Profil pribadi · Empty trip · Edit · Pengaturan',
    accent: '#4ECDC4',
    screens: [
      { index: 35, label: 'Cari — Idle', component: <Screen35SearchIdle /> },
      { index: 7, label: 'Cari — Hasil', component: <Screen7SearchUser /> },
      { index: 10, label: 'Profil Publik', component: <Screen10PublicProfile /> },
      { index: 37, label: 'Profil Publik — Empty Trip', component: <Screen37PublicProfileEmptyTrip /> },
      { index: 8, label: 'Profil & Eksplorasi', component: <Screen8Profile /> },
      { index: 36, label: 'Profil — Empty Trip', component: <Screen36ProfileEmptyTrip /> },
      { index: 9, label: 'Edit Profil', component: <Screen9EditProfil /> },
      { index: 11, label: 'Pengaturan', component: <Screen11Settings /> },
      { index: 39, label: 'Bantuan & FAQ', component: <Screen39SettingsHelpFaq /> },
      { index: 38, label: 'Hapus Akun', component: <Screen38SettingsDeleteAccount /> },
    ],
  },
  {
    id: 5,
    title: '5. Pembuatan Perjalanan — Tab [+]',
    subtitle: 'Form buat trip · Multi kandidat tanggal · Validasi form',
    accent: '#FF6B6B',
    screens: [
      { index: 12, label: 'Buat Perjalanan', component: <Screen12Create /> },
      { index: 13, label: 'Multi Kandidat Tanggal', component: <Screen13MultiDatePicker /> },
      { index: 14, label: 'Form Validation', component: <Screen14FormValidation /> },
    ],
  },
  {
    id: 6,
    title: '6. Detail Perjalanan — Destinasi · Voting · Chat',
    subtitle: 'Tab destinasi & sheet tambah · Tab voting · Tab chat · Detail destinasi',
    accent: '#1A1A2E',
    screens: [
      { index: 15, label: 'Detail — Destinasi', component: <Screen15Destinations /> },
      { index: 16, label: 'Detail — Voting', component: <Screen16Voting /> },
      { index: 17, label: 'Detail — Group Chat', component: <Screen17Chat /> },
      { index: 18, label: 'Sheet — Tambah Destinasi', component: <Screen18BottomSheetDestinasi /> },
      { index: 19, label: 'Detail Destinasi', component: <Screen19DestinationDetail /> },
    ],
  },
  {
    id: 7,
    title: '7. Mengundang Partisipan & Kolaborasi',
    subtitle: 'Bottom sheet undang via username atau email',
    accent: '#4ECDC4',
    screens: [
      { index: 20, label: 'Sheet — Undang Teman', component: <Screen20BottomSheetUndang /> },
    ],
  },
  {
    id: 8,
    title: '8. Voting Tanggal',
    subtitle: 'Jadwal dikunci · Modal sukses sync Google Calendar (lihat tab Voting di §6)',
    accent: '#FF6B6B',
    screens: [
      { index: 21, label: 'Jadwal Dikunci', component: <Screen21StatusLocked /> },
      { index: 22, label: 'Sync Sukses Modal', component: <Screen22CalendarSyncModal /> },
    ],
  },
  {
    id: 9,
    title: '9. Grup Chat Internal Perjalanan',
    subtitle: 'Empty state chat · Long press menu (lihat tab Chat di §6)',
    accent: '#4ECDC4',
    screens: [
      { index: 23, label: 'Empty — Chat', component: <Screen23EmptyChat /> },
      { index: 24, label: 'Long Press Menu', component: <Screen24ChatLongPress /> },
    ],
  },
  {
    id: 10,
    title: '10. Wishlist — Tab 4',
    subtitle: 'Grid/list destinasi impian · Bottom sheet tambah wishlist',
    accent: '#FF6B6B',
    screens: [
      { index: 25, label: 'Wishlist', component: <Screen25Wishlist /> },
      { index: 26, label: 'Sheet — Tambah Wishlist', component: <Screen26BottomSheetWishlist /> },
    ],
  },
  {
    id: 11,
    title: '11. Notifikasi',
    subtitle: 'Undangan trip · Follow baru · Voting deadline · Update destinasi',
    accent: '#1A1A2E',
    screens: [
      { index: 27, label: 'Notifikasi', component: <Screen27Notifikasi /> },
    ],
  },
  {
    id: 13,
    title: '13. System States & Micro-interactions',
    subtitle: 'Skeleton · Toast · Error · Dark mode · Design tokens (§12 Pengaturan → layar 11 di §4)',
    accent: '#FF6B6B',
    screens: [
      { index: 28, label: 'Skeleton Loading', component: <Screen28SkeletonLoading /> },
      { index: 29, label: 'Toast & Snackbar', component: <Screen29ToastComponents /> },
      { index: 30, label: 'Error 404 / Offline', component: <Screen30Error /> },
      { index: 31, label: 'Dark Mode — Beranda', component: <Screen31DarkBeranda /> },
      { index: 32, label: 'Design Tokens', component: <Screen32DesignTokens /> },
    ],
  },
];

function ScreenRow({ screens }: { screens: WorkflowSection['screens'] }) {
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
        <PhoneFrame key={screen.index} index={screen.index} label={screen.label}>
          {screen.component}
        </PhoneFrame>
      ))}
    </div>
  );
}

function SectionLabel({
  title,
  subtitle,
  accent = '#FF6B6B',
}: {
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: 24, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 20, backgroundColor: accent, borderRadius: 4 }} />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', margin: 0, letterSpacing: -0.3 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 13, color: '#9091A0', margin: '5px 0 0 14px', fontWeight: 500 }}>{subtitle}</p>
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
              backgroundColor: '#FF6B6B',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255,107,107,0.40)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" stroke="none" />
            </svg>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1A1A2E', margin: 0, letterSpacing: -0.8 }}>
            Atur Perjalanan
          </h1>
        </div>

        <p style={{ color: '#9091A0', fontSize: 15, margin: '0 0 22px', fontWeight: 500 }}>
          Mobile App UI · 39 Layar High-Fidelity · Layar 1–39 selaras urutan docs/WORKFLOW.md
        </p>

        {/* Palette swatches */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#FFFFFF', label: 'Canvas', border: '1px solid #E0D8CE' },
            { color: '#1A1A2E', label: 'Charcoal' },
            { color: '#FF6B6B', label: 'Warm Coral' },
            { color: '#4ECDC4', label: 'Soft Teal' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 20, height: 20, backgroundColor: s.color, borderRadius: 6, border: s.border ?? 'none', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{s.label}</span>
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
            <ScreenRow screens={section.screens} />
          </div>
        </div>
      ))}
    </div>
  );
}
