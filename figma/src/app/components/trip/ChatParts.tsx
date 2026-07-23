import type { CSSProperties, ReactNode } from 'react';
import { Send, Paperclip, Image, Video, X, Play, Reply, Copy, Trash2 } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { TRIP_IMAGES } from '../tripImages';
import {
  TripDetailHeader,
  TripDetailTabs,
  DEFAULT_TRIP_TAB_COUNTS,
  TRIP_COUNTS_DATE_PENDING,
  type TripTabCounts,
} from './TripDetailParts';
import { TRIP_DATE_PENDING } from './CreateTripParts';

type TripDetailChatLayoutProps = {
  subtitle?: string;
  counts?: TripTabCounts;
  children: ReactNode;
  inputDisabled?: boolean;
  attachMenuOpen?: boolean;
  hideInputBar?: boolean;
  overlay?: ReactNode;
};

export function TripDetailChatLayout({
  subtitle = TRIP_DATE_PENDING,
  counts = DEFAULT_TRIP_TAB_COUNTS,
  children,
  inputDisabled = false,
  attachMenuOpen = false,
  hideInputBar = false,
  overlay,
}: TripDetailChatLayoutProps) {
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
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={subtitle} />
      <TripDetailTabs activeTab="chat" counts={counts} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: C.light,
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
          {overlay}
        </div>
        {!hideInputBar && <ChatInputBar disabled={inputDisabled} attachMenuOpen={attachMenuOpen} />}
      </div>
    </div>
  );
}

export function ChatDateSeparator({ label = 'Hari ini' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
    </div>
  );
}

type ChatLongPressMenuProps = {
  /** Hapus hanya tersedia untuk pesan sendiri */
  isOwnMessage?: boolean;
};

export function ChatLongPressMenu({ isOwnMessage = false }: ChatLongPressMenuProps) {
  const items = [
    { icon: Reply, label: 'Balas', color: C.charcoal },
    { icon: Copy, label: 'Salin Teks', color: C.charcoal },
    ...(isOwnMessage ? [{ icon: Trash2, label: 'Hapus', color: C.danger }] : []),
  ];

  return (
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
      {items.map((item, idx) => (
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
            borderBottom: idx < items.length - 1 ? `1px solid ${C.border}` : 'none',
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
  );
}

export function ChatLongPressBackdrop() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15,15,20,0.38)',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  );
}

export type ChatMessageKind = 'text' | 'photo' | 'video';

export type ChatReplyPreview = {
  from: string;
  isMe: boolean;
  text: string;
};

type ChatMessage = {
  id: number;
  kind?: ChatMessageKind;
  from: string;
  initial: string;
  color: string;
  text?: string;
  mediaUrl?: string;
  mediaDuration?: string;
  time: string;
  isMe: boolean;
  replyTo?: ChatReplyPreview;
};

export function withDemoChatColors(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((m, i) => ({
    ...m,
    color: m.isMe ? AVATAR_COLORS[4] : AVATAR_COLORS[i % 4],
  }));
}

function ChatReplyQuote({
  reply,
  accentColor = C.coral,
  inOwnBubble,
}: {
  reply: ChatReplyPreview;
  accentColor?: string;
  inOwnBubble: boolean;
}) {
  const label = reply.isMe ? 'Kamu' : reply.from;
  const truncate: CSSProperties = {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  if (inOwnBubble) {
    return (
      <div
        style={{
          borderLeft: '3px solid rgba(255,255,255,0.65)',
          backgroundColor: 'rgba(0,0,0,0.14)',
          borderRadius: 8,
          padding: '6px 10px',
          marginBottom: 6,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: 'white', margin: 0 }}>{label}</p>
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.88)',
            margin: '2px 0 0',
            lineHeight: 1.4,
            ...truncate,
          }}
        >
          {reply.text}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderLeft: `3px solid ${accentColor}`,
        backgroundColor: C.light,
        borderRadius: 8,
        padding: '6px 10px',
        marginBottom: 6,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 700, color: accentColor, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', lineHeight: 1.4, ...truncate }}>
        {reply.text}
      </p>
    </div>
  );
}

function ChatMediaBubble({
  msg,
  dimmed,
  highlighted,
}: {
  msg: ChatMessage;
  dimmed?: boolean;
  highlighted?: boolean;
}) {
  const isVideo = msg.kind === 'video';
  const opacity = dimmed ? 0.28 : 1;
  const alignEnd = msg.isMe;
  const bubbleShadow = highlighted
    ? `0 8px 32px ${msg.isMe ? `${C.coral}60` : C.shadow}`
    : `0 3px 12px ${msg.isMe ? `${C.coral}40` : C.shadow}`;

  const mediaBlock = (
    <div style={{ maxWidth: '72%', minWidth: 140 }}>
      {!msg.isMe && (
        <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>
          {msg.from}
        </p>
      )}
      <div
        style={{
          borderRadius: alignEnd ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: bubbleShadow,
          backgroundColor: C.white,
          transform: highlighted ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={msg.mediaUrl}
            alt=""
            style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
          />
          {isVideo && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.22)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Video size={18} color={C.charcoal} strokeWidth={2.5} />
                </div>
              </div>
              {msg.mediaDuration && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    padding: '2px 6px',
                    borderRadius: 6,
                  }}
                >
                  {msg.mediaDuration}
                </span>
              )}
            </>
          )}
        </div>
        {msg.text && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: msg.isMe ? 'white' : C.charcoal,
              margin: 0,
              padding: '10px 14px',
              lineHeight: 1.5,
              backgroundColor: msg.isMe ? C.coral : C.white,
            }}
          >
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );

  if (alignEnd) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          gap: 8,
          opacity,
          zIndex: highlighted ? 20 : 1,
        }}
      >
        <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
        {mediaBlock}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        opacity,
        zIndex: highlighted ? 20 : 1,
      }}
    >
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
      {mediaBlock}
      <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
    </div>
  );
}

export function ChatMessageBubble({
  msg,
  dimmed = false,
  highlighted = false,
}: {
  msg: ChatMessage;
  dimmed?: boolean;
  highlighted?: boolean;
}) {
  const kind = msg.kind ?? 'text';
  if (kind === 'photo' || kind === 'video') {
    return <ChatMediaBubble msg={msg} dimmed={dimmed} highlighted={highlighted} />;
  }

  const opacity = dimmed ? 0.28 : 1;

  if (msg.isMe) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          gap: 8,
          opacity,
          zIndex: highlighted ? 20 : 1,
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
            boxShadow: highlighted ? `0 8px 32px ${C.coral}60` : `0 3px 12px ${C.coral}40`,
            transform: highlighted ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {msg.replyTo && <ChatReplyQuote reply={msg.replyTo} inOwnBubble />}
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        opacity,
        zIndex: highlighted ? 20 : 1,
      }}
    >
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
        <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>
          {msg.from}
        </p>
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
          {msg.replyTo && (
            <ChatReplyQuote reply={msg.replyTo} accentColor={msg.color} inOwnBubble={false} />
          )}
          {msg.text}
        </div>
      </div>
      <span style={{ fontSize: 10, color: C.mutedLight }}>{msg.time}</span>
    </div>
  );
}

export function ChatAttachMenu() {
  const items = [
    { icon: Image, label: 'Foto', color: C.teal },
    { icon: Video, label: 'Video', color: C.coral },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        bottom: '100%',
        marginBottom: 8,
        width: 200,
        backgroundColor: C.white,
        borderRadius: 14,
        padding: '6px 0 8px',
        boxShadow: `0 10px 32px ${C.shadow}, 0 0 0 1px ${C.border}`,
        zIndex: 30,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 14px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: item.color === C.teal ? C.tealLight : C.coralLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={16} color={item.color} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{item.label}</span>
          </button>
        );
      })}
      <p
        style={{
          fontSize: 10,
          color: C.muted,
          margin: '4px 14px 0',
          lineHeight: 1.45,
          fontWeight: 500,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 8,
        }}
      >
        Foto & video dari chat otomatis masuk tab Media.
      </p>
    </div>
  );
}

export function ChatInputBar({
  disabled = false,
  attachMenuOpen = false,
}: {
  disabled?: boolean;
  attachMenuOpen?: boolean;
}) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '12px 16px 16px',
        backgroundColor: C.white,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}
    >
      {attachMenuOpen && <ChatAttachMenu />}
      <div
        style={{
          width: 36,
          height: 36,
          backgroundColor: attachMenuOpen ? C.coralLight : C.light,
          border: attachMenuOpen ? `1.5px solid ${C.coral}` : 'none',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Paperclip size={16} color={attachMenuOpen ? C.coral : C.muted} strokeWidth={2.5} />
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
          backgroundColor: disabled ? C.border : C.coral,
          borderRadius: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer',
          boxShadow: disabled ? 'none' : `0 6px 18px ${C.coral}50`,
          flexShrink: 0,
        }}
      >
        <Send size={17} color={disabled ? C.muted : 'white'} strokeWidth={2.5} />
      </div>
    </div>
  );
}

type ChatMediaComposerProps = {
  kind: 'photo' | 'video';
  mediaUrl: string;
  mediaDuration?: string;
  /** Kosong = placeholder caption; terisi = state siap kirim */
  caption?: string;
};

/** Composer kirim foto/video + caption — ala WhatsApp */
export function ChatMediaComposer({
  kind,
  mediaUrl,
  mediaDuration = '0:18',
  caption,
}: ChatMediaComposerProps) {
  const hasCaption = Boolean(caption?.trim());
  const label = kind === 'photo' ? 'Kirim Foto' : 'Kirim Video';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        backgroundColor: '#0D0D12',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          paddingTop: 52,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} color="white" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{label}</span>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 20px 16px',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxHeight: '100%' }}>
          <img
            src={mediaUrl}
            alt=""
            style={{
              width: '100%',
              maxHeight: '52vh',
              objectFit: 'contain',
              borderRadius: 12,
              display: 'block',
            }}
          />
          {kind === 'video' && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={24} color={C.charcoal} strokeWidth={2.5} style={{ marginLeft: 3 }} />
                </div>
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                {mediaDuration}
              </span>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '12px 16px 28px',
          flexShrink: 0,
          backgroundColor: '#16161F',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div
            style={{
              flex: 1,
              minHeight: 44,
              maxHeight: 100,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 22,
              padding: '11px 16px',
              border: hasCaption ? `1.5px solid ${C.coral}50` : '1.5px solid rgba(255,255,255,0.1)',
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: hasCaption ? 'white' : 'rgba(255,255,255,0.4)',
                fontWeight: hasCaption ? 500 : 400,
                lineHeight: 1.45,
              }}
            >
              {hasCaption ? caption : 'Tambahkan caption...'}
            </span>
          </div>
          <button
            type="button"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: C.coral,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: `0 6px 18px ${C.coral}50`,
            }}
          >
            <Send size={18} color="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: 'Rina',
    initial: 'R',
    color: '#FF6B6B',
    text: 'Hei guys! Gimana kalau kita berangkat tanggal 15 Juni? 🏝️',
    time: '10:32',
    isMe: false,
  },
  {
    id: 2,
    from: 'Me',
    initial: 'B',
    color: '#4ECDC4',
    text: 'Bagus banget! Aku udah cek tiketnya, masih ada yang murah 🎉',
    time: '10:33',
    isMe: true,
  },
  {
    id: 3,
    from: 'Budi',
    initial: 'B',
    color: '#FFB347',
    text: 'Aku prefer 22 Juni sih, jadwal kantor masih ada nih minggu itu 😅',
    time: '10:35',
    isMe: false,
  },
  {
    id: 4,
    from: 'Rina',
    initial: 'R',
    color: '#FF6B6B',
    text: 'Oh iya, kita voting aja yuk biar fair 🗳️',
    time: '10:36',
    isMe: false,
  },
  {
    id: 5,
    from: 'Me',
    initial: 'B',
    color: '#4ECDC4',
    text: 'Setuju banget! Langsung ke tab Voting yuk',
    time: '10:36',
    isMe: true,
  },
  {
    id: 6,
    from: 'Sari',
    initial: 'S',
    color: '#A78BFA',
    text: 'Aku vote 15 Juni ya! Siap kapanpun 🙋‍♀️',
    time: '10:38',
    isMe: false,
  },
];

const CHAT_LONG_PRESS_MESSAGES = withDemoChatColors(DEMO_CHAT_MESSAGES.slice(0, 5));

/** Layar chat dengan long-press menu pada satu pesan */
export function ChatLongPressView({ highlightedId }: { highlightedId: number }) {
  const highlightedMessage = CHAT_LONG_PRESS_MESSAGES.find((m) => m.id === highlightedId)!;
  const counts = { ...TRIP_COUNTS_DATE_PENDING, chat: 0 };

  return (
    <TripDetailChatLayout
      subtitle={TRIP_DATE_PENDING}
      counts={counts}
      overlay={
        <>
          <ChatLongPressBackdrop />
          <ChatLongPressMenu isOwnMessage={highlightedMessage.isMe} />
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
        {CHAT_LONG_PRESS_MESSAGES.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            msg={msg}
            dimmed={msg.id !== highlightedId}
            highlighted={msg.id === highlightedId}
          />
        ))}
      </div>
    </TripDetailChatLayout>
  );
}

export const DEMO_CHAT_PHOTO_SENT: ChatMessage = {
  id: 7,
  kind: 'photo',
  from: 'Me',
  initial: 'B',
  color: '#4ECDC4',
  mediaUrl: TRIP_IMAGES.giliBeach,
  text: 'Pantai pas low tide 🌊',
  time: '11:02',
  isMe: true,
};

export const DEMO_CHAT_VIDEO_SENT: ChatMessage = {
  id: 8,
  kind: 'video',
  from: 'Me',
  initial: 'B',
  color: '#4ECDC4',
  mediaUrl: TRIP_IMAGES.bromo,
  mediaDuration: '0:24',
  text: 'Sunrise dari atas awan ☁️',
  time: '11:05',
  isMe: true,
};

export const DEMO_CHAT_PHOTO_RECEIVED: ChatMessage = {
  id: 7,
  kind: 'photo',
  from: 'Rina',
  initial: 'R',
  color: '#FF6B6B',
  mediaUrl: TRIP_IMAGES.giliBeach,
  text: 'Spot snorkeling kemarin 🐠',
  time: '11:02',
  isMe: false,
};

export const DEMO_CHAT_VIDEO_RECEIVED: ChatMessage = {
  id: 8,
  kind: 'video',
  from: 'Budi',
  initial: 'B',
  color: '#FFB347',
  mediaUrl: TRIP_IMAGES.bromo,
  mediaDuration: '0:18',
  text: 'View dari puncak tadi pagi!',
  time: '11:05',
  isMe: false,
};

type ChatThreadViewProps = {
  messages: ChatMessage[];
  subtitle?: string;
  counts?: TripTabCounts;
  attachMenuOpen?: boolean;
  inputDisabled?: boolean;
};

/** Daftar pesan dalam thread chat */
export function ChatThreadView({
  messages,
  subtitle = TRIP_DATE_PENDING,
  counts = TRIP_COUNTS_DATE_PENDING,
  attachMenuOpen = false,
  inputDisabled = false,
}: ChatThreadViewProps) {
  const colored = withDemoChatColors(messages);

  return (
    <TripDetailChatLayout
      subtitle={subtitle}
      counts={counts}
      attachMenuOpen={attachMenuOpen}
      inputDisabled={inputDisabled}
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
        }}
      >
        <ChatDateSeparator />
        {colored.map((msg) => (
          <ChatMessageBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </TripDetailChatLayout>
  );
}

function EmptyChatIllustration() {
  return (
    <svg width="168" height="148" viewBox="0 0 168 148" fill="none">
      <circle cx="84" cy="74" r="64" fill={C.coralLight} />
      <rect
        x="18"
        y="32"
        width="74"
        height="46"
        rx="16"
        fill={C.white}
        stroke={C.border}
        strokeWidth="2"
      />
      <path
        d="M30 78 L22 94 L46 78"
        fill={C.white}
        stroke={C.border}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="28" y="46" width="44" height="7" rx="3.5" fill={C.light} />
      <rect x="28" y="59" width="30" height="7" rx="3.5" fill={C.light} />
      <rect x="76" y="58" width="74" height="46" rx="16" fill={C.coral} opacity="0.18" />
      <rect
        x="76"
        y="58"
        width="74"
        height="46"
        rx="16"
        fill="none"
        stroke={C.coral}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M138 104 L146 120 L122 104"
        fill={C.coral}
        opacity="0.4"
        stroke={C.coral}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="86" y="72" width="44" height="7" rx="3.5" fill={C.coral} opacity="0.25" />
      <rect x="86" y="85" width="32" height="7" rx="3.5" fill={C.coral} opacity="0.2" />
    </svg>
  );
}

const EMPTY_CHAT_COUNTS = { ...TRIP_COUNTS_DATE_PENDING, chat: 0 };

export function ChatEmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 36px 20px',
        textAlign: 'center',
        fontFamily: FONT,
      }}
    >
      <EmptyChatIllustration />
      <h3
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: C.charcoal,
          margin: '18px 0 9px',
          letterSpacing: -0.4,
        }}
      >
        Belum ada obrolan
      </h3>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
        Sapa teman perjalananmu dan mulai diskusi.
      </p>
    </div>
  );
}

const CHAT_COMPOSER_BACKDROP_MESSAGES = withDemoChatColors(DEMO_CHAT_MESSAGES.slice(0, 4));

/** Shell composer kirim media — chat redup di belakang */
export function ChatComposerScreen({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        <TripDetailChatLayout
          subtitle={TRIP_DATE_PENDING}
          counts={TRIP_COUNTS_DATE_PENDING}
          hideInputBar
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              padding: '16px 16px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <ChatDateSeparator />
            {CHAT_COMPOSER_BACKDROP_MESSAGES.map((msg) => (
              <ChatMessageBubble key={msg.id} msg={msg} />
            ))}
          </div>
        </TripDetailChatLayout>
      </div>
      {children}
    </div>
  );
}

const REPLY_ORIGINAL_RINA_VOTING = 'Oh iya, kita voting aja yuk biar fair 🗳️';
const REPLY_ORIGINAL_ME_TICKET = 'Bagus banget! Aku udah cek tiketnya, masih ada yang murah 🎉';
const REPLY_ORIGINAL_BUDI_JUNE =
  'Aku prefer 22 Juni sih, jadwal kantor masih ada nih minggu itu 😅';
const REPLY_ORIGINAL_ME_VOTING = 'Setuju banget! Langsung ke tab Voting yuk';

/** Saya balas pesan anggota lain */
export const DEMO_REPLY_ME_TO_OTHER: ChatMessage[] = [
  {
    id: 1,
    from: 'Rina',
    initial: 'R',
    color: AVATAR_COLORS[0],
    text: REPLY_ORIGINAL_RINA_VOTING,
    time: '10:36',
    isMe: false,
  },
  {
    id: 2,
    from: 'Me',
    initial: 'B',
    color: AVATAR_COLORS[4],
    text: 'Setuju! Langsung ke tab Voting aja',
    time: '10:37',
    isMe: true,
    replyTo: { from: 'Rina', isMe: false, text: REPLY_ORIGINAL_RINA_VOTING },
  },
];

/** Saya balas pesan sendiri */
export const DEMO_REPLY_ME_TO_SELF: ChatMessage[] = [
  {
    id: 1,
    from: 'Me',
    initial: 'B',
    color: AVATAR_COLORS[4],
    text: REPLY_ORIGINAL_ME_TICKET,
    time: '10:33',
    isMe: true,
  },
  {
    id: 2,
    from: 'Me',
    initial: 'B',
    color: AVATAR_COLORS[4],
    text: 'Eh tunggu, cek lagi besok—harga bisa turun lagi',
    time: '10:34',
    isMe: true,
    replyTo: { from: 'Me', isMe: true, text: REPLY_ORIGINAL_ME_TICKET },
  },
];

/** Anggota lain balas pesan anggota lain */
export const DEMO_REPLY_OTHER_TO_OTHER: ChatMessage[] = [
  {
    id: 1,
    from: 'Budi',
    initial: 'B',
    color: AVATAR_COLORS[2],
    text: REPLY_ORIGINAL_BUDI_JUNE,
    time: '10:35',
    isMe: false,
  },
  {
    id: 2,
    from: 'Rina',
    initial: 'R',
    color: AVATAR_COLORS[0],
    text: '22 Juni juga oke sih buat aku 👍',
    time: '10:36',
    isMe: false,
    replyTo: { from: 'Budi', isMe: false, text: REPLY_ORIGINAL_BUDI_JUNE },
  },
];

/** Anggota lain balas pesan saya */
export const DEMO_REPLY_OTHER_TO_ME: ChatMessage[] = [
  {
    id: 1,
    from: 'Me',
    initial: 'B',
    color: AVATAR_COLORS[4],
    text: REPLY_ORIGINAL_ME_VOTING,
    time: '10:36',
    isMe: true,
  },
  {
    id: 2,
    from: 'Sari',
    initial: 'S',
    color: AVATAR_COLORS[3],
    text: 'Aku udah buka tab Voting-nya! 🗳️',
    time: '10:38',
    isMe: false,
    replyTo: { from: 'Me', isMe: true, text: REPLY_ORIGINAL_ME_VOTING },
  },
];

export type { ChatMessage };
