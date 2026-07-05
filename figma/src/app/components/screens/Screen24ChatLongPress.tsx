import { Reply, Copy, Trash2 } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailChatLayout, ChatDateSeparator, ChatMessageBubble, DEMO_CHAT_MESSAGES } from '../trip/ChatParts';

const CHAT_COUNTS = { ...TRIP_COUNTS_DATE_PENDING, chat: 0 };
const HIGHLIGHTED_ID = 4;

const messages = DEMO_CHAT_MESSAGES.slice(0, 5).map((m, i) => ({
  ...m,
  color: m.isMe ? AVATAR_COLORS[4] : AVATAR_COLORS[i % 4],
}));

/** Tab Chat — long press context menu */
export function Screen24ChatLongPress() {
  return (
    <TripDetailChatLayout
      subtitle={TRIP_DATE_PENDING}
      counts={CHAT_COUNTS}
      overlay={
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15,15,20,0.38)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: C.white,
              borderRadius: 18,
              boxShadow: '0 20px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              width: 196,
              zIndex: 30,
            }}
          >
            {[
              { icon: Reply, label: 'Balas', color: C.charcoal },
              { icon: Copy, label: 'Salin Teks', color: C.charcoal },
              { icon: Trash2, label: 'Hapus', color: C.danger },
            ].map((item, idx) => (
              <button
                key={item.label}
                type="button"
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
                <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      }
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
        }}
      >
        <ChatDateSeparator />
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            msg={msg}
            dimmed={msg.id !== HIGHLIGHTED_ID}
            highlighted={msg.id === HIGHLIGHTED_ID}
          />
        ))}
      </div>
    </TripDetailChatLayout>
  );
}
