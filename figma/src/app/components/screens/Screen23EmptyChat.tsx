import { ArrowLeft, MoreHorizontal, Send, Paperclip } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

function EmptyChatIllustration() {
  return (
    <svg width="168" height="148" viewBox="0 0 168 148" fill="none">
      {/* Soft background */}
      <circle cx="84" cy="74" r="64" fill="#FFF3F3" />
      {/* Left bubble */}
      <rect x="18" y="32" width="74" height="46" rx="16" fill="white" stroke="#EBEBF2" strokeWidth="2" />
      {/* Left bubble tail */}
      <path d="M30 78 L22 94 L46 78" fill="white" stroke="#EBEBF2" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Left bubble lines */}
      <rect x="28" y="46" width="44" height="7" rx="3.5" fill="#F0F0F5" />
      <rect x="28" y="59" width="30" height="7" rx="3.5" fill="#F0F0F5" />
      {/* Right bubble (coral) */}
      <rect x="76" y="58" width="74" height="46" rx="16" fill="#FF6B6B" opacity="0.18" />
      <rect x="76" y="58" width="74" height="46" rx="16" fill="none" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.5" />
      {/* Right bubble tail */}
      <path d="M138 104 L146 120 L122 104" fill="#FF6B6B" opacity="0.4" stroke="#FF6B6B" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Right bubble lines */}
      <rect x="86" y="72" width="44" height="7" rx="3.5" fill="#FF6B6B" opacity="0.25" />
      <rect x="86" y="85" width="32" height="7" rx="3.5" fill="#FF6B6B" opacity="0.2" />
      {/* Paper plane top-right */}
      <g transform="translate(126, 20) rotate(-20)">
        <path d="M0 0 L18 -6 L18 0 L10 4Z" fill="#4ECDC4" />
        <path d="M0 0 L7 9 L5 14" fill="#4ECDC4" opacity="0.55" />
      </g>
      {/* Sparkles */}
      <circle cx="38" cy="24" r="3.5" fill="#4ECDC4" opacity="0.7" />
      <circle cx="154" cy="42" r="2.5" fill="#FFB347" opacity="0.8" />
      <circle cx="20" cy="118" r="2.5" fill="#FF6B6B" opacity="0.5" />
    </svg>
  );
}

export function Screen23EmptyChat() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F7F7FB',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Header */}
      <div
        style={{
          backgroundColor: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 20px 12px',
          borderBottom: `1px solid ${C.border}`,
          boxShadow: `0 2px 12px ${C.shadow}`,
        }}
      >
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center', flex: 1, margin: '0 12px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Grup: Lombok Escape</h2>
          <p style={{ fontSize: 11, color: C.teal, margin: '2px 0 0', fontWeight: 600 }}>5 anggota</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {['R', 'B', 'A'].map((init, i) => (
            <div
              key={i}
              style={{
                width: 26, height: 26,
                backgroundColor: AVATAR_COLORS[i],
                borderRadius: '50%',
                border: '2px solid white',
                marginLeft: i > 0 ? -8 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 800, color: 'white',
              }}
            >
              {init}
            </div>
          ))}
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ display: 'flex', backgroundColor: C.white, padding: '0 20px', borderBottom: `1.5px solid ${C.border}` }}>
        {[
          { label: 'Destinasi', active: false },
          { label: 'Voting', active: false },
          { label: 'Chat', active: true },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 10, paddingTop: 10, marginRight: 24, cursor: 'pointer',
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

      {/* Empty state */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 36px 20px',
          textAlign: 'center',
        }}
      >
        <EmptyChatIllustration />
        <h3 style={{ fontSize: 19, fontWeight: 800, color: C.charcoal, margin: '18px 0 9px', letterSpacing: -0.4 }}>
          Belum ada obrolan
        </h3>
        <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
          Sapa teman perjalananmu dan mulai diskusi.
        </p>
      </div>

      {/* Chat input bar */}
      <div
        style={{
          padding: '12px 16px 100px',
          backgroundColor: C.white,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36, height: 36,
            backgroundColor: C.light, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Paperclip size={16} color={C.muted} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '11px 16px',
            fontSize: 14,
            color: C.mutedLight,
            border: `1px solid ${C.border}`,
          }}
        >
          Tulis pesan...
        </div>
        <div
          style={{
            width: 40, height: 40,
            backgroundColor: C.border, borderRadius: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Send size={17} color={C.muted} strokeWidth={2.5} />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
