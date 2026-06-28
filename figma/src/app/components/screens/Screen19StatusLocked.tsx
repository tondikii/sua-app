import { ArrowLeft, MoreHorizontal, Lock, CalendarDays, CheckCircle } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

export function Screen19StatusLocked() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Lombok Weekend Escape</h2>
          <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>5 anggota</p>
        </div>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MoreHorizontal size={18} color={C.charcoal} />
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ display: 'flex', margin: '16px 20px 0', borderBottom: `1.5px solid ${C.border}` }}>
        {[
          { label: 'Destinasi', active: false },
          { label: 'Voting', active: true },
          { label: 'Chat', active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 12, paddingTop: 2, marginRight: 24, cursor: 'pointer',
              borderBottom: tab.active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: tab.active ? 700 : 500, color: tab.active ? C.coral : C.muted }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Teal locked banner */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: C.teal,
          borderRadius: 16,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36, height: 36,
            backgroundColor: 'rgba(255,255,255,0.22)',
            borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Lock size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 800, margin: 0 }}>Jadwal Telah Dikunci 🔒</p>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12, margin: '2px 0 0', fontWeight: 500 }}>
            Semua anggota telah menyetujui tanggal ini
          </p>
        </div>
      </div>

      {/* Date display card */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: C.white,
          borderRadius: 22,
          padding: '24px 22px',
          boxShadow: `0 6px 28px ${C.shadow}, 0 0 0 1.5px ${C.teal}30`,
          border: `1.5px solid ${C.teal}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.teal, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>
              Tanggal Resmi Perjalanan
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.6, lineHeight: 1.15 }}>
              15 – 18<br />Juni 2026
            </h2>
          </div>
          <div
            style={{
              width: 48, height: 48,
              backgroundColor: C.tealLight,
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CalendarDays size={22} color={C.teal} strokeWidth={2} />
          </div>
        </div>

        {/* Duration + day labels */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: '4 Hari', icon: '🌤️' },
            { label: 'Senin – Kamis', icon: '📅' },
            { label: '5 Anggota', icon: '👥' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                backgroundColor: C.light,
                borderRadius: 10,
                padding: '6px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: C.charcoal,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Voted by */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 600 }}>Dikunci oleh:</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['B', 'R', 'A', 'D', 'S'].map((init, i) => (
              <div
                key={i}
                style={{
                  width: 26, height: 26,
                  backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  borderRadius: '50%',
                  border: '2px solid white',
                  marginLeft: i > 0 ? -9 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: 'white',
                  zIndex: 10 - i,
                }}
              >
                {init}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6 }}>
            <CheckCircle size={13} color={C.teal} strokeWidth={2.5} />
            <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Semua setuju</span>
          </div>
        </div>
      </div>

      {/* Calendar sync button */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          style={{
            width: '100%',
            height: 52,
            backgroundColor: 'transparent',
            color: C.teal,
            border: `2px solid ${C.teal}`,
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
          }}
        >
          <CalendarDays size={17} strokeWidth={2.5} />
          Sinkronisasi ke Google Calendar
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
