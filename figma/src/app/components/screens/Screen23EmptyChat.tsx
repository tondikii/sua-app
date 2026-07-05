import { C, FONT } from '../colors';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailChatLayout } from '../trip/ChatParts';

const EMPTY_CHAT_COUNTS = { ...TRIP_COUNTS_DATE_PENDING, chat: 0 };

function EmptyChatIllustration() {
  return (
    <svg width="168" height="148" viewBox="0 0 168 148" fill="none">
      <circle cx="84" cy="74" r="64" fill={C.coralLight} />
      <rect x="18" y="32" width="74" height="46" rx="16" fill={C.white} stroke={C.border} strokeWidth="2" />
      <path d="M30 78 L22 94 L46 78" fill={C.white} stroke={C.border} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="28" y="46" width="44" height="7" rx="3.5" fill={C.light} />
      <rect x="28" y="59" width="30" height="7" rx="3.5" fill={C.light} />
      <rect x="76" y="58" width="74" height="46" rx="16" fill={C.coral} opacity="0.18" />
      <rect x="76" y="58" width="74" height="46" rx="16" fill="none" stroke={C.coral} strokeWidth="1.5" opacity="0.5" />
      <path d="M138 104 L146 120 L122 104" fill={C.coral} opacity="0.4" stroke={C.coral} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="86" y="72" width="44" height="7" rx="3.5" fill={C.coral} opacity="0.25" />
      <rect x="86" y="85" width="32" height="7" rx="3.5" fill={C.coral} opacity="0.2" />
    </svg>
  );
}

/** Tab Chat — empty state */
export function Screen23EmptyChat() {
  return (
    <TripDetailChatLayout subtitle={TRIP_DATE_PENDING} counts={EMPTY_CHAT_COUNTS} inputDisabled>
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
        <h3 style={{ fontSize: 19, fontWeight: 800, color: C.charcoal, margin: '18px 0 9px', letterSpacing: -0.4 }}>
          Belum ada obrolan
        </h3>
        <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
          Sapa teman perjalananmu dan mulai diskusi.
        </p>
      </div>
    </TripDetailChatLayout>
  );
}
