import { ArrowLeft, MoreHorizontal, Send, Paperclip } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const messages = [
  { id: 1, from: 'Rina', initial: 'R', color: AVATAR_COLORS[0], text: 'Hei guys! Gimana kalau kita berangkat tanggal 15 Juni? 🏝️', time: '10:32', isMe: false },
  { id: 2, from: 'Me', initial: 'B', color: AVATAR_COLORS[4], text: 'Bagus banget! Aku udah cek tiketnya, masih ada yang murah 🎉', time: '10:33', isMe: true },
  { id: 3, from: 'Budi', initial: 'B', color: AVATAR_COLORS[3], text: 'Aku prefer 22 Juni sih, jadwal kantor masih ada nih minggu itu 😅', time: '10:35', isMe: false },
  { id: 4, from: 'Rina', initial: 'R', color: AVATAR_COLORS[0], text: 'Oh iya, kita voting aja yuk biar fair 🗳️', time: '10:36', isMe: false },
  { id: 5, from: 'Me', initial: 'B', color: AVATAR_COLORS[4], text: 'Setuju banget! Langsung ke tab Voting yuk', time: '10:36', isMe: true },
  { id: 6, from: 'Sari', initial: 'S', color: AVATAR_COLORS[1], text: 'Aku vote 15 Juni ya! Siap kapanpun 🙋‍♀️', time: '10:38', isMe: false },
];

export function Screen17Chat() {
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
      {/* Dynamic island spacer */}
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
          <p style={{ fontSize: 11, color: C.teal, margin: '2px 0 0', fontWeight: 600 }}>5 anggota · aktif sekarang</p>
        </div>
        {/* Group avatar stack */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {['R', 'B', 'A'].map((init, i) => (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                backgroundColor: AVATAR_COLORS[i],
                borderRadius: '50%',
                border: '2px solid white',
                marginLeft: i > 0 ? -8 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 800,
                color: 'white',
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
              paddingBottom: 10,
              paddingTop: 10,
              marginRight: 24,
              cursor: 'pointer',
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

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          padding: '16px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'hidden',
        }}
      >
        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Hari ini</span>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        </div>

        {messages.map((msg) =>
          msg.isMe ? (
            /* Me — right side, coral */
            <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 8 }}>
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
                  boxShadow: `0 3px 12px ${C.coral}40`,
                }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            /* Others — left side */
            <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: msg.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {msg.initial}
              </div>
              <div style={{ maxWidth: '72%' }}>
                <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>{msg.from}</p>
                <div
                  style={{
                    backgroundColor: C.white,
                    color: C.charcoal,
                    padding: '10px 14px',
                    borderRadius: '18px 18px 18px 4px',
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    boxShadow: `0 3px 12px ${C.shadow}`,
                  }}
                >
                  {msg.text}
                </div>
              </div>
              <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
            </div>
          )
        )}
      </div>

      {/* Input bar */}
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
            width: 36,
            height: 36,
            backgroundColor: C.light,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
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
            width: 40,
            height: 40,
            backgroundColor: C.coral,
            borderRadius: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 6px 18px ${C.coral}50`,
            flexShrink: 0,
          }}
        >
          <Send size={17} color="white" strokeWidth={2.5} />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
