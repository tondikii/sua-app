import '../styles/index.css';
import { PhoneFrame } from './components/PhoneFrame';

// Row 1 — core flows
import { Screen1Auth } from './components/screens/Screen1Auth';
import { Screen2Home } from './components/screens/Screen2Home';
import { Screen3Profile } from './components/screens/Screen3Profile';
import { Screen4Create } from './components/screens/Screen4Create';
import { Screen5Destinations } from './components/screens/Screen5Destinations';
import { Screen6Voting } from './components/screens/Screen6Voting';
import { Screen7Chat } from './components/screens/Screen7Chat';
import { Screen8Wishlist } from './components/screens/Screen8Wishlist';

// Row 2 — extended flows
import { Screen9EduOnboarding } from './components/screens/Screen9EduOnboarding';
import { Screen10Username } from './components/screens/Screen10Username';
import { Screen11Notifikasi } from './components/screens/Screen11Notifikasi';
import { Screen12SearchUser } from './components/screens/Screen12SearchUser';
import { Screen13BottomSheetDestinasi } from './components/screens/Screen13BottomSheetDestinasi';
import { Screen14BottomSheetUndang } from './components/screens/Screen14BottomSheetUndang';
import { Screen15BottomSheetWishlist } from './components/screens/Screen15BottomSheetWishlist';
import { Screen16EditProfil } from './components/screens/Screen16EditProfil';

// Row 3 — edge cases, empty states, system components
import { Screen17EmptyBeranda } from './components/screens/Screen17EmptyBeranda';

import { Screen18EmptyChat } from './components/screens/Screen18EmptyChat';
import { Screen19StatusLocked } from './components/screens/Screen19StatusLocked';
import { Screen20PublicProfile } from './components/screens/Screen20PublicProfile';
import { Screen21Settings } from './components/screens/Screen21Settings';
import { Screen22SkeletonLoading } from './components/screens/Screen22SkeletonLoading';
import { Screen23ToastComponents } from './components/screens/Screen23ToastComponents';
import { Screen24Error } from './components/screens/Screen24Error';

// Row 4 — micro-interactions, dark mode, design system
import { Screen25Splash } from './components/screens/Screen25Splash';
import { Screen26DarkBeranda } from './components/screens/Screen26DarkBeranda';
import { Screen27FormValidation } from './components/screens/Screen27FormValidation';
import { Screen28ChatLongPress } from './components/screens/Screen28ChatLongPress';
import { Screen29DestinationDetail } from './components/screens/Screen29DestinationDetail';
import { Screen30MultiDatePicker } from './components/screens/Screen30MultiDatePicker';
import { Screen31CalendarSyncModal } from './components/screens/Screen31CalendarSyncModal';
import { Screen32DesignTokens } from './components/screens/Screen32DesignTokens';

const FONT = "'Plus Jakarta Sans', -apple-system, sans-serif";

const row1 = [
  { index: 1,  label: 'Auth & Onboarding',     component: <Screen1Auth /> },
  { index: 2,  label: 'Beranda',                component: <Screen2Home /> },
  { index: 3,  label: 'Profil & Eksplorasi',    component: <Screen3Profile /> },
  { index: 4,  label: 'Buat Perjalanan',        component: <Screen4Create /> },
  { index: 5,  label: 'Detail — Destinasi',     component: <Screen5Destinations /> },
  { index: 6,  label: 'Detail — Voting',        component: <Screen6Voting /> },
  { index: 7,  label: 'Detail — Group Chat',    component: <Screen7Chat /> },
  { index: 8,  label: 'Wishlist',               component: <Screen8Wishlist /> },
];

const row2 = [
  { index: 9,  label: 'Edu Onboarding',           component: <Screen9EduOnboarding /> },
  { index: 10, label: 'Buat Username',             component: <Screen10Username /> },
  { index: 11, label: 'Notifikasi',                component: <Screen11Notifikasi /> },
  { index: 12, label: 'Pencarian Pengguna',        component: <Screen12SearchUser /> },
  { index: 13, label: 'Sheet — Tambah Destinasi', component: <Screen13BottomSheetDestinasi /> },
  { index: 14, label: 'Sheet — Undang Teman',      component: <Screen14BottomSheetUndang /> },
  { index: 15, label: 'Sheet — Tambah Wishlist',   component: <Screen15BottomSheetWishlist /> },
  { index: 16, label: 'Edit Profil',               component: <Screen16EditProfil /> },
];

const row3 = [
  { index: 17, label: 'Empty — Beranda',        component: <Screen17EmptyBeranda /> },
  { index: 18, label: 'Empty — Chat',           component: <Screen18EmptyChat /> },
  { index: 19, label: 'Jadwal Dikunci',         component: <Screen19StatusLocked /> },
  { index: 20, label: 'Profil Publik',          component: <Screen20PublicProfile /> },
  { index: 21, label: 'Pengaturan',             component: <Screen21Settings /> },
  { index: 22, label: 'Skeleton Loading',       component: <Screen22SkeletonLoading /> },
  { index: 23, label: 'Toast & Snackbar',       component: <Screen23ToastComponents /> },
  { index: 24, label: 'Error 404 / Offline',    component: <Screen24Error /> },
];

const row4 = [
  { index: 25, label: 'Splash Screen',          component: <Screen25Splash /> },
  { index: 26, label: 'Dark Mode — Beranda',    component: <Screen26DarkBeranda /> },
  { index: 27, label: 'Form Validation',        component: <Screen27FormValidation /> },
  { index: 28, label: 'Long Press Menu',        component: <Screen28ChatLongPress /> },
  { index: 29, label: 'Detail Destinasi',       component: <Screen29DestinationDetail /> },
  { index: 30, label: 'Multi Kandidat Tanggal', component: <Screen30MultiDatePicker /> },
  { index: 31, label: 'Sync Sukses Modal',      component: <Screen31CalendarSyncModal /> },
  { index: 32, label: 'Design Tokens',          component: <Screen32DesignTokens /> },
];

function ScreenRow({ screens }: { screens: typeof row1 }) {
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
          Mobile App UI · 32 Layar High-Fidelity · Palette Sunset &amp; Beach
        </p>

        {/* Palette swatches */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#FFFFFF', label: 'Canvas',      border: '1px solid #E0D8CE' },
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

      {/* ── Row 1: Alur Utama ── */}
      <div style={{ padding: '0 60px 16px' }}>
        <SectionLabel
          title="Alur Utama — Layar 1–8"
          subtitle="Onboarding · Home · Profil · Buat Perjalanan · Detail Trip · Voting · Chat · Wishlist"
          accent="#FF6B6B"
        />
      </div>
      <div style={{ padding: '0 60px 60px' }}>
        <ScreenRow screens={row1} />
      </div>

      {/* ── Row 2: Alur Lanjutan ── */}
      <div style={{ padding: '0 60px 16px' }}>
        <SectionLabel
          title="Alur Lanjutan — Layar 9–16"
          subtitle="Edu Onboarding · Registrasi · Notifikasi · Pencarian · Bottom Sheets · Edit Profil"
          accent="#4ECDC4"
        />
      </div>
      <div style={{ padding: '0 60px 60px' }}>
        <ScreenRow screens={row2} />
      </div>

      {/* ── Row 3: Edge Cases & System ── */}
      <div style={{ padding: '0 60px 16px' }}>
        <SectionLabel
          title="Edge Cases & Komponen Sistem — Layar 17–24"
          subtitle="Empty States · Status Terkunci · Profil Publik · Pengaturan · Skeleton · Toast · Error 404"
          accent="#1A1A2E"
        />
      </div>
      <div style={{ padding: '0 60px 60px' }}>
        <ScreenRow screens={row3} />
      </div>

      {/* ── Row 4: Micro-interactions, Dark Mode & Design System ── */}
      <div style={{ padding: '0 60px 16px' }}>
        <SectionLabel
          title="Micro-interactions, Dark Mode & Design System — Layar 25–32"
          subtitle="Splash · Dark Mode · Validasi Form · Long Press · Detail Sheet · Multi-Tanggal · Modal Sukses · Design Tokens"
          accent="#FF6B6B"
        />
      </div>
      <div style={{ padding: '0 60px 80px' }}>
        <ScreenRow screens={row4} />
      </div>
    </div>
  );
}
