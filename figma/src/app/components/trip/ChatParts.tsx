import type { ReactNode } from 'react';
import { Send, Paperclip, Image, Video, X, Play } from 'lucide-react';
import { C, FONT } from '../colors';
import { TRIP_IMAGES } from '../tripImages';
import { TripDetailHeader, TripDetailTabs, DEFAULT_TRIP_TAB_COUNTS, type TripTabCounts } from './TripDetailParts';
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

export type ChatMessageKind = 'text' | 'photo' | 'video';

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
};


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
        <p style={{ fontSize: 10, color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>{msg.from}</p>
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, opacity, zIndex: highlighted ? 20 : 1 }}>
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

export function ChatMessageBubble({ msg, dimmed = false, highlighted = false }: { msg: ChatMessage; dimmed?: boolean; highlighted?: boolean }) {
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
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, opacity, zIndex: highlighted ? 20 : 1 }}>
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

export function ChatInputBar({ disabled = false, attachMenuOpen = false }: { disabled?: boolean; attachMenuOpen?: boolean }) {
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
  { id: 1, from: 'Rina', initial: 'R', color: '#FF6B6B', text: 'Hei guys! Gimana kalau kita berangkat tanggal 15 Juni? 🏝️', time: '10:32', isMe: false },
  { id: 2, from: 'Me', initial: 'B', color: '#4ECDC4', text: 'Bagus banget! Aku udah cek tiketnya, masih ada yang murah 🎉', time: '10:33', isMe: true },
  { id: 3, from: 'Budi', initial: 'B', color: '#FFB347', text: 'Aku prefer 22 Juni sih, jadwal kantor masih ada nih minggu itu 😅', time: '10:35', isMe: false },
  { id: 4, from: 'Rina', initial: 'R', color: '#FF6B6B', text: 'Oh iya, kita voting aja yuk biar fair 🗳️', time: '10:36', isMe: false },
  { id: 5, from: 'Me', initial: 'B', color: '#4ECDC4', text: 'Setuju banget! Langsung ke tab Voting yuk', time: '10:36', isMe: true },
  { id: 6, from: 'Sari', initial: 'S', color: '#A78BFA', text: 'Aku vote 15 Juni ya! Siap kapanpun 🙋‍♀️', time: '10:38', isMe: false },
];

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

export type { ChatMessage };
