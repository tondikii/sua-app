import { AVATAR_COLORS, FONT } from '../colors';
import { TRIP_IMAGES } from '../tripImages';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import {
  TripDetailChatLayout,
  ChatDateSeparator,
  ChatMessageBubble,
  ChatMediaComposer,
  DEMO_CHAT_MESSAGES,
} from '../trip/ChatParts';

const backdropMessages = DEMO_CHAT_MESSAGES.slice(0, 4).map((m, i) => ({
  ...m,
  color: m.isMe ? AVATAR_COLORS[4] : AVATAR_COLORS[i % 4],
}));

function ChatComposerScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        <TripDetailChatLayout subtitle={TRIP_DATE_PENDING} counts={TRIP_COUNTS_DATE_PENDING} hideInputBar>
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
            {backdropMessages.map((msg) => (
              <ChatMessageBubble key={msg.id} msg={msg} />
            ))}
          </div>
        </TripDetailChatLayout>
      </div>
      {children}
    </div>
  );
}

/** Composer — kirim foto + caption (kosong) */
export function Screen99ChatSendPhoto() {
  return (
    <ChatComposerScreenShell>
      <ChatMediaComposer kind="photo" mediaUrl={TRIP_IMAGES.giliBeach} />
    </ChatComposerScreenShell>
  );
}

/** Composer — kirim foto + caption terisi */
export function Screen101ChatSendPhotoCaption() {
  return (
    <ChatComposerScreenShell>
      <ChatMediaComposer
        kind="photo"
        mediaUrl={TRIP_IMAGES.lombok}
        caption="Pantai pas low tide 🌊"
      />
    </ChatComposerScreenShell>
  );
}

/** Composer — kirim video + caption (kosong) */
export function Screen100ChatSendVideo() {
  return (
    <ChatComposerScreenShell>
      <ChatMediaComposer kind="video" mediaUrl={TRIP_IMAGES.bromo} mediaDuration="0:24" />
    </ChatComposerScreenShell>
  );
}

/** Composer — kirim video + caption terisi */
export function Screen102ChatSendVideoCaption() {
  return (
    <ChatComposerScreenShell>
      <ChatMediaComposer
        kind="video"
        mediaUrl={TRIP_IMAGES.bromo}
        mediaDuration="0:24"
        caption="Sunrise dari atas awan ☁️"
      />
    </ChatComposerScreenShell>
  );
}
