import { ArrowLeft, Send, Paperclip, Reply, Copy, Trash2 } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const messages = [
  { id: 1, from: 'Rina', initial: 'R', color: AVATAR_COLORS[0], text: 'Hei guys! Gimana kalau kita berangkat tanggal 15 Juni? 🏝️', time: '10:32', isMe: false },
  { id: 2, from: 'Me', initial: 'B', color: AVATAR_COLORS[4], text: 'Bagus banget! Aku udah cek tiketnya, masih ada yang murah 🎉', time: '10:33', isMe: true },
  { id: 3, from: 'Budi', initial: 'B', color: AVATAR_COLORS[3], text: 'Aku prefer 22 Juni, jadwal kantor masih ada 😅', time: '10:35', isMe: false },
  { id: 4, from: 'Me', initial: 'B', color: AVATAR_COLORS[4], text: 'Setuju banget! Langsung ke tab Voting yuk', time: '10:36', isMe: true },
  { id: 5, from: 'Sari', initial: 'S', color: AVATAR_COLORS[1], text: 'Aku vote 15 Juni ya! 🙋‍♀️', time: '10:38', isMe: false },
];

const HIGHLIGHTED_ID = 4; // the long-pressed message

export function Screen28ChatLongPress() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F7F7FB', display: 'flex', flexDirection: 'column', fontFamily: FONT, overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ backgroundColor: C.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 12px', borderBottom: `1px solid ${C.border}`, boxShadow: `0 2px 12px ${C.shadow}` }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center', flex: 1, margin: '0 12px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Grup: Lombok Escape</h2>
          <p style={{ fontSize: 11, color: C.teal, margin: '2px 0 0', fontWeight: 600 }}>5 anggota · aktif sekarang</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {['R', 'B', 'A'].map((init, i) => (
            <div key={i} style={{ width: 26, height: 26, backgroundColor: AVATAR_COLORS[i], borderRadius: '50%', border: '2px solid white', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'white' }}>
              {init}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: C.white, padding: '0 20px', borderBottom: `1.5px solid ${C.border}` }}>
        {['Destinasi', 'Voting', 'Chat'].map((label) => (
          <div key={label} style={{ paddingBottom: 10, paddingTop: 10, marginRight: 24, cursor: 'pointer', borderBottom: label === 'Chat' ? `2.5px solid ${C.coral}` : 'none', marginBottom: -1.5 }}>
            <span style={{ fontSize: 14, fontWeight: label === 'Chat' ? 700 : 500, color: label === 'Chat' ? C.coral : C.muted }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Messages + dim overlay */}
      <div style={{ flex: 1, padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', position: 'relative' }}>
        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Hari ini</span>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        </div>

        {messages.map((msg) => {
          const isHighlighted = msg.id === HIGHLIGHTED_ID;
          const isDimmed = !isHighlighted;

          return msg.isMe ? (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                gap: 8,
                opacity: isDimmed ? 0.28 : 1,
                zIndex: isHighlighted ? 20 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
              <div
                style={{
                  maxWidth: '72%',
                  backgroundColor: C.coral,
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: '18px 18px 4px 18px',
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  boxShadow: isHighlighted ? `0 8px 32px ${C.coral}60` : `0 3px 12px ${C.coral}40`,
                  transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                opacity: isDimmed ? 0.28 : 1,
                zIndex: isHighlighted ? 20 : 1,
              }}
            >
              <div style={{ width: 30, height: 30, backgroundColor: msg.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {msg.initial}
              </div>
              <div style={{ maxWidth: '72%' }}>
                <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>{msg.from}</p>
                <div style={{ backgroundColor: C.white, color: C.charcoal, padding: '10px 14px', borderRadius: '18px 18px 18px 4px', fontSize: 13, fontWeight: 500, lineHeight: 1.5, boxShadow: `0 3px 12px ${C.shadow}` }}>
                  {msg.text}
                </div>
              </div>
              <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
            </div>
          );
        })}

        {/* Dim scrim — covers everything except highlighted */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,15,20,0.38)', zIndex: 10, pointerEvents: 'none' }} />

        {/* Floating context menu — positioned above the highlighted message */}
        <div
          style={{
            position: 'absolute',
            bottom: 108,
            right: 16,
            backgroundColor: C.white,
            borderRadius: 18,
            boxShadow: '0 20px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            width: 196,
            zIndex: 30,
          }}
        >
          {/* Arrow pointing down toward the message */}
          <div style={{ position: 'absolute', bottom: -8, right: 36, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${C.white}`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />

          {[
            { icon: Reply, label: 'Balas', emoji: '↩', color: C.charcoal, red: false },
            { icon: Copy, label: 'Salin Teks', emoji: '📋', color: C.charcoal, red: false },
            { icon: Trash2, label: 'Hapus', emoji: '🗑', color: '#E53935', red: true },
          ].map((item, idx) => (
            <button
              key={item.label}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: idx < 2 ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: FONT,
              }}
            >
              <item.icon size={17} color={item.color} strokeWidth={2} />
              <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>
                {item.label} {item.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div style={{ padding: '12px 16px 100px', backgroundColor: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Paperclip size={16} color={C.muted} />
        </div>
        <div style={{ flex: 1, backgroundColor: C.light, borderRadius: 14, padding: '11px 16px', fontSize: 14, color: C.mutedLight, border: `1px solid ${C.border}` }}>
          Tulis pesan...
        </div>
        <div style={{ width: 40, height: 40, backgroundColor: C.coral, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 6px 18px ${C.coral}50` }}>
          <Send size={17} color="white" strokeWidth={2.5} />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
