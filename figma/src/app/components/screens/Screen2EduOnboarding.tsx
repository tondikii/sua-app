import { useState, type ReactNode } from 'react';
import { ThumbsUp, MapPin, ChevronDown } from 'lucide-react';
import { C, FONT, AVATAR_COLORS } from '../colors';
import {
  TRIP_DATE_PENDING,
  VOTING_DATE_CANDIDATES,
  TRIP_LOCKED_DATES,
} from '../trip/CreateTripParts';
import {
  ITINERARY_VOTING_TITLE,
  buildItineraryTimeline,
  resolveItineraryTimeState,
  ITINERARY_TIME_STATE_META,
  type ItineraryDay,
  type ItineraryItem,
  type ItineraryTimeState,
} from '../trip/ItineraryParts';
import { ActivityTimelineThumb } from '../trip/ActivityParts';
import { VOTING_TYPE_META } from '../trip/VotingParts';
import { TRIP_IMAGES } from '../tripImages';

/** Judul demo generik — bukan destinasi spesifik */
const DEMO_TRIP_TITLE = 'Trip Akhir Pekan';

const IMAGES = {
  intro:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=700&fit=crop&auto=format',
  voting:
    'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=700&fit=crop&auto=format',
  itinerary: TRIP_IMAGES.giliBeach,
  collaboration:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=700&fit=crop&auto=format',
};

type TripTabId = 'itinerary' | 'voting' | 'chat' | 'media';

type Slide =
  | { kind: 'intro'; image: string; imageAlt: string; title: string; subtitle: string }
  | {
      kind: 'pair';
      image: string;
      imageAlt: string;
      problem: { label: string; title: string; body: string };
      solution: { label: string; title: string; body: string };
      preview: ReactNode;
    };

const SLIDES: Slide[] = [
  {
    kind: 'intro',
    image: IMAGES.intro,
    imageAlt: 'Teman merencanakan liburan bersama',
    title: 'Realisasikan Wacana Liburanmu',
    subtitle:
      'Janjian "nanti jalan-jalan" sering mandeg? Sepakat jadwal, susun aktivitas, dan update bareng — semuanya di satu trip.',
  },
  {
    kind: 'pair',
    image: IMAGES.voting,
    imageAlt: 'Teman memilih tanggal liburan',
    problem: {
      label: 'Masalah',
      title: 'Sepakat Jadwal Susah Banget',
      body: 'Minggu ini sibuk, minggu depan juga — poll di chat udah puluhan, tapi tanggal liburan tetap nggak pernah keputusan.',
    },
    solution: {
      label: 'Solusi',
      title: 'Vote Bareng, Hasil Jelas',
      body: 'Ajukan beberapa opsi tanggal, semua anggota vote di satu tempat, lihat mana yang paling banyak suara, lalu kunci.',
    },
    preview: <MiniVotingPreview />,
  },
  {
    kind: 'pair',
    image: IMAGES.itinerary,
    imageAlt: 'Destinasi liburan',
    problem: {
      label: 'Masalah',
      title: 'Rencana Berserakan, Urutan Nggak Jelas',
      body: 'Link TikTok, pin Maps, catatan di Notes — semua ada, tapi nggak ada yang tahu jam berapa berangkat, ke mana dulu, dan makan di mana.',
    },
    solution: {
      label: 'Solusi',
      title: 'Timeline Harian yang Jelas',
      body: 'Susun aktivitas berurutan per jam — urutan hari, waktu senggang, dan status jalan semua kelihatan sekilas tanpa tanya-tanya lagi.',
    },
    preview: <MiniItineraryPreview />,
  },
  {
    kind: 'pair',
    image: IMAGES.collaboration,
    imageAlt: 'Teman berkoordinasi lewat ponsel',
    problem: {
      label: 'Masalah',
      title: 'Chat Trip Kecampur',
      body: 'Ngobrol soal trip masih lewat grup yang sama dengan chat harian — nggak ada ruang khusus, jadi pesan penting tenggelam dan foto liburan susah dilacak lagi.',
    },
    solution: {
      label: 'Solusi',
      title: 'Ruang Diskusi Khusus Trip',
      body: 'Grup chat khusus anggota trip — ngobrol, kirim foto, dan semua media otomatis tersimpan rapi di satu tempat.',
    },
    preview: <MiniChatPreview />,
  },
];

/** Hari itinerary selaras TRIP_LOCKED_DATES (19 Jun 08:00 – 22 Jun 17:00) */
const ONBOARDING_ITINERARY_DAYS: ItineraryDay[] = [
  {
    id: 1,
    dateLabel: '19 Juni 2026',
    dayLabel: 'Hari 1',
    windowStart: '07:00',
    windowEnd: '24:00',
    items: [
      {
        id: 1,
        startTime: '07:00',
        endTime: '08:30',
        title: 'Titik kumpul — Terminal travel',
        location: 'Pool van · area keberangkatan',
        kind: 'gather',
      },
      {
        id: 2,
        startTime: '08:30',
        endTime: '10:30',
        title: 'Perjalanan ke penginapan',
        description: 'Van sewa · 5 orang',
        kind: 'transport',
        coverIcon: 'bus',
      },
      {
        id: 3,
        startTime: '10:30',
        endTime: '11:30',
        title: 'Check-in & istirahat',
        kind: 'activity',
      },
      {
        id: 4,
        startTime: '12:00',
        endTime: '13:00',
        title: 'Makan siang — warung lokal',
        kind: 'meal',
      },
      {
        id: 5,
        startTime: '14:00',
        endTime: '16:30',
        title: 'Pantai Tiga Warna',
        location: 'Kawasan pantai timur',
        kind: 'destination',
        gmapsThumbUrl: TRIP_IMAGES.giliBeach,
      },
      {
        id: 6,
        startTime: '17:00',
        endTime: '18:30',
        title: 'Bukit Merese — sunset',
        location: 'Puncak bukit',
        kind: 'destination',
      },
      {
        id: 7,
        startTime: '19:00',
        endTime: '20:30',
        title: 'Makan malam bareng',
        description: 'Seafood · booking 6 orang',
        kind: 'meal',
      },
      {
        id: 8,
        startTime: '21:00',
        endTime: '22:30',
        title: 'Kembali ke penginapan',
        kind: 'transport',
        coverIcon: 'bus',
      },
    ],
  },
  {
    id: 2,
    dateLabel: '20 Juni 2026',
    dayLabel: 'Hari 2',
    windowStart: '08:00',
    windowEnd: '24:00',
    items: [
      { id: 9, startTime: '08:00', endTime: '09:00', title: 'Sarapan di penginapan', kind: 'meal' },
      {
        id: 10,
        startTime: '09:30',
        endTime: '12:00',
        title: 'Snorkeling & island hopping',
        location: 'Gili terdekat',
        kind: 'activity',
        gmapsThumbUrl: TRIP_IMAGES.giliBeach,
      },
      {
        id: 11,
        startTime: '12:30',
        endTime: '13:30',
        title: 'Makan siang di warung pantai',
        kind: 'meal',
      },
      {
        id: 12,
        startTime: '14:00',
        endTime: '17:00',
        title: 'Eksplor desa & pasar lokal',
        kind: 'destination',
      },
      {
        id: 13,
        startTime: '19:00',
        endTime: '21:00',
        title: 'Makan malam & foto grup',
        kind: 'meal',
      },
    ],
  },
  {
    id: 3,
    dateLabel: '21 Juni 2026',
    dayLabel: 'Hari 3',
    windowStart: '08:00',
    windowEnd: '24:00',
    items: [
      { id: 14, startTime: '08:30', endTime: '09:30', title: 'Sarapan & persiapan', kind: 'meal' },
      {
        id: 15,
        startTime: '10:00',
        endTime: '13:30',
        title: 'Trekking air terjun',
        location: 'Hutan & sungai',
        kind: 'destination',
        gmapsThumbUrl: TRIP_IMAGES.tumpakSewu,
      },
      { id: 16, startTime: '14:00', endTime: '15:00', title: 'Makan siang', kind: 'meal' },
      {
        id: 17,
        startTime: '15:30',
        endTime: '17:30',
        title: 'Belanja oleh-oleh',
        kind: 'activity',
      },
      {
        id: 18,
        startTime: '19:30',
        endTime: '21:00',
        title: 'Makan malam terakhir bareng',
        kind: 'meal',
      },
    ],
  },
  {
    id: 4,
    dateLabel: '22 Juni 2026',
    dayLabel: 'Hari 4',
    windowStart: '08:00',
    windowEnd: '17:00',
    items: [
      { id: 19, startTime: '08:00', endTime: '09:00', title: 'Check-out & sarapan', kind: 'meal' },
      {
        id: 20,
        startTime: '09:30',
        endTime: '11:30',
        title: 'Perjalanan pulang',
        description: 'Van sewa · titik drop-off',
        kind: 'transport',
        coverIcon: 'bus',
      },
      {
        id: 21,
        startTime: '12:00',
        endTime: '14:00',
        title: 'Belanja oleh-oleh',
        location: 'Rest area perjalanan',
        kind: 'activity',
      },
    ],
  },
];

const ONBOARDING_ITINERARY_ACTIVITY_COUNT = ONBOARDING_ITINERARY_DAYS.reduce(
  (sum, d) => sum + d.items.length,
  0,
);

const TAB_LABELS_VOTING: { id: TripTabId; label: string; count?: number }[] = [
  { id: 'itinerary', label: 'Itinerary', count: 4 },
  { id: 'voting', label: 'Voting', count: 2 },
  { id: 'chat', label: 'Chat', count: 5 },
  { id: 'media', label: 'Media', count: 4 },
];

const TAB_LABELS_ITINERARY: { id: TripTabId; label: string; count?: number }[] = [
  { id: 'itinerary', label: 'Itinerary', count: ONBOARDING_ITINERARY_ACTIVITY_COUNT },
  { id: 'voting', label: 'Voting', count: 2 },
  { id: 'chat', label: 'Chat', count: 2 },
  { id: 'media', label: 'Media', count: 4 },
];

function MiniTripDetailFrame({
  activeTab,
  subtitle = TRIP_DATE_PENDING,
  tabLabels = TAB_LABELS_VOTING,
  contentPadding = 10,
  children,
}: {
  activeTab: TripTabId;
  subtitle?: string;
  tabLabels?: { id: TripTabId; label: string; count?: number }[];
  contentPadding?: number | string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        boxShadow: `0 6px 24px ${C.shadow}`,
      }}
    >
      <div style={{ padding: '10px 12px 8px', borderBottom: `1px solid ${C.border}` }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: C.charcoal,
            margin: 0,
            textAlign: 'center',
            letterSpacing: -0.2,
          }}
        >
          {DEMO_TRIP_TITLE}
        </p>
        <p
          style={{
            fontSize: 9,
            color: C.muted,
            margin: '2px 0 0',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', borderBottom: `1.5px solid ${C.border}`, padding: '0 8px' }}>
        {tabLabels.map((tab) => {
          const active = tab.id === activeTab;
          const isChat = tab.id === 'chat';
          return (
            <div
              key={tab.id}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                paddingBottom: 8,
                paddingTop: 6,
                borderBottom: active ? `2px solid ${C.coral}` : 'none',
                marginBottom: -1.5,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: active ? 700 : 500,
                  color: active ? C.coral : C.muted,
                }}
              >
                {tab.label}
              </span>
              {tab.count !== undefined && !isChat && (
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: active ? C.coral : C.muted,
                    backgroundColor: active ? C.coralLight : C.light,
                    padding: '1px 5px',
                    borderRadius: 6,
                    lineHeight: 1.35,
                  }}
                >
                  {tab.count}
                </span>
              )}
              {isChat && tab.count && (
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: 'white',
                    backgroundColor: C.coral,
                    padding: '1px 5px',
                    borderRadius: 10,
                    minWidth: 14,
                    textAlign: 'center',
                    lineHeight: 1.35,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: contentPadding,
          backgroundColor: activeTab === 'chat' ? C.light : C.white,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function MiniVoterAvatars({ initials }: { initials: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {initials.map((init, i) => (
        <div
          key={init}
          style={{
            width: 20,
            height: 20,
            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
            borderRadius: '50%',
            border: '1.5px solid white',
            marginLeft: i > 0 ? -6 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {init}
        </div>
      ))}
    </div>
  );
}

function MiniVotingCandidateRow({
  range,
  days,
  votes,
  avatars,
  voted,
}: {
  range: string;
  days: string;
  votes: number;
  avatars: string[];
  voted?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: voted ? C.coralLight : C.light,
        borderRadius: 8,
        padding: '6px 8px',
        border: voted ? `1.5px solid ${C.coral}` : '1px solid transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 4,
        }}
      >
        <div style={{ minWidth: 0, flex: 1, paddingRight: 6 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.charcoal,
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            {range}
          </p>
          <p style={{ fontSize: 8, color: C.muted, margin: '1px 0 0', lineHeight: 1.3 }}>{days}</p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 8,
            fontWeight: 700,
            color: voted ? C.coral : C.muted,
            backgroundColor: voted ? C.coralLight : C.white,
            padding: '2px 5px',
            borderRadius: 20,
            flexShrink: 0,
          }}
        >
          <ThumbsUp size={8} strokeWidth={2.5} />
          {votes}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MiniVoterAvatars initials={avatars} />
        {voted ? (
          <span style={{ fontSize: 8, fontWeight: 700, color: C.teal }}>✓ Voted</span>
        ) : (
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: C.muted,
              backgroundColor: C.white,
              padding: '2px 6px',
              borderRadius: 6,
              border: `1px solid ${C.border}`,
            }}
          >
            Vote
          </span>
        )}
      </div>
    </div>
  );
}

function MiniVotingPreview() {
  const tanggalMeta = VOTING_TYPE_META.tanggal;
  const TanggalIcon = tanggalMeta.icon;

  return (
    <MiniTripDetailFrame activeTab="voting" tabLabels={TAB_LABELS_VOTING}>
      <div
        style={{
          backgroundColor: C.white,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          boxShadow: `0 2px 8px ${C.shadow}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 8px 12px' }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              backgroundColor: tanggalMeta.bg,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TanggalIcon size={14} color={tanggalMeta.color} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.charcoal, margin: 0 }}>
              Tanggal Perjalanan
            </p>
            <p style={{ fontSize: 9, color: C.muted, margin: '1px 0 0', fontWeight: 500 }}>
              3 kandidat · tenggat 18 Jun
            </p>
          </div>
          <ChevronDown
            size={14}
            color={C.muted}
            strokeWidth={2.5}
            style={{ transform: 'rotate(180deg)', flexShrink: 0 }}
          />
        </div>

        <div
          style={{
            padding: '0 8px 8px',
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingTop: 8,
          }}
        >
          {VOTING_DATE_CANDIDATES.map((cand) => (
            <MiniVotingCandidateRow
              key={cand.id}
              range={cand.range}
              days={cand.days}
              votes={cand.votes}
              avatars={cand.avatars}
              voted={cand.voted}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 8,
          padding: '8px 10px',
          backgroundColor: C.white,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          opacity: 0.85,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            backgroundColor: VOTING_TYPE_META.destinasi.bg,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MapPin size={14} color={VOTING_TYPE_META.destinasi.color} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: C.charcoal, margin: 0 }}>
            {ITINERARY_VOTING_TITLE}
          </p>
          <p style={{ fontSize: 9, color: C.muted, margin: '1px 0 0', fontWeight: 500 }}>
            3 opsi · slot 11:30–13:00
          </p>
        </div>
        <ChevronDown size={14} color={C.muted} strokeWidth={2.5} />
      </div>
    </MiniTripDetailFrame>
  );
}

function MiniItineraryGapRow({ startTime, endTime }: { startTime: string; endTime: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
      <div style={{ width: 22, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            border: `1.5px dashed ${C.mutedLight}`,
            backgroundColor: C.white,
          }}
        />
      </div>
      <p style={{ fontSize: 8, color: C.mutedLight, margin: 0, fontWeight: 500, lineHeight: 1.35 }}>
        <span style={{ fontWeight: 700, color: C.muted }}>
          {startTime} – {endTime}
        </span>
        {' · '}Kosong
      </p>
    </div>
  );
}

function MiniItineraryItemRow({
  item,
  timeState,
  showConnector = true,
}: {
  item: ItineraryItem;
  timeState: ItineraryTimeState;
  showConnector?: boolean;
}) {
  const stateMeta = ITINERARY_TIME_STATE_META[timeState];
  const isPresent = timeState === 'present';

  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        opacity: stateMeta.cardOpacity,
        marginBottom: showConnector ? 4 : 0,
      }}
    >
      <div
        style={{
          width: 22,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: isPresent ? 10 : 8,
            height: isPresent ? 10 : 8,
            borderRadius: '50%',
            backgroundColor: stateMeta.dotColor,
            boxShadow: `0 0 0 2px ${stateMeta.dotRing}`,
            flexShrink: 0,
          }}
        />
        {showConnector && (
          <div
            style={{ flex: 1, width: 1.5, backgroundColor: C.border, marginTop: 2, minHeight: 8 }}
          />
        )}
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: C.white,
          borderRadius: 10,
          padding: '5px 7px',
          border: `1.5px solid ${stateMeta.cardBorder}`,
          boxShadow: isPresent ? `0 3px 10px ${C.coral}22` : `0 1px 6px ${C.shadow}`,
          display: 'flex',
          gap: 5,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ width: 24, height: 24, flexShrink: 0, overflow: 'hidden', borderRadius: 6 }}>
          <div style={{ transform: 'scale(0.67)', transformOrigin: 'top left' }}>
            <ActivityTimelineThumb item={item} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexWrap: 'wrap',
              marginBottom: 1,
            }}
          >
            <p style={{ fontSize: 8, fontWeight: 700, color: stateMeta.timeColor, margin: 0 }}>
              {item.startTime} – {item.endTime}
            </p>
            {isPresent && (
              <span
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  color: C.coral,
                  backgroundColor: C.coralLight,
                  padding: '1px 4px',
                  borderRadius: 5,
                  textTransform: 'uppercase',
                }}
              >
                Sekarang
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.charcoal,
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </p>
          {(item.description || item.location) && (
            <p
              style={{
                fontSize: 8,
                color: C.muted,
                margin: '1px 0 0',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {item.description ?? item.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Selaras TRIP_LOCKED_DATES — hari 1 penuh (07:00–24:00), jam 14:00 = Pantai Tiga Warna */
function MiniItineraryPreview() {
  const activeDayId = 1;
  const day =
    ONBOARDING_ITINERARY_DAYS.find((d) => d.id === activeDayId) ?? ONBOARDING_ITINERARY_DAYS[0];
  const referenceNow = { dayId: activeDayId, time: '14:00' };
  const segments = buildItineraryTimeline(day);

  return (
    <MiniTripDetailFrame
      activeTab="itinerary"
      subtitle={TRIP_LOCKED_DATES.subtitle}
      tabLabels={TAB_LABELS_ITINERARY}
      contentPadding="8px 10px 10px"
    >
      <p style={{ fontSize: 8, color: C.muted, margin: '0 0 5px', fontWeight: 600 }}>
        {ONBOARDING_ITINERARY_ACTIVITY_COUNT} aktivitas · {ONBOARDING_ITINERARY_DAYS.length} hari
      </p>

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {ONBOARDING_ITINERARY_DAYS.map((d) => {
          const active = d.id === activeDayId;
          return (
            <div
              key={d.id}
              style={{
                padding: '4px 8px',
                borderRadius: 8,
                backgroundColor: active ? C.coralLight : C.light,
                border: active ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontSize: 8,
                  fontWeight: active ? 800 : 600,
                  color: active ? C.coral : C.muted,
                  margin: 0,
                }}
              >
                {d.dayLabel}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 5 }}>
        <p
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: C.coral,
            margin: '0 0 1px',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}
        >
          {day.dayLabel}
        </p>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}
        >
          <p style={{ fontSize: 10, fontWeight: 800, color: C.charcoal, margin: 0 }}>
            {day.dateLabel}
          </p>
          <span
            style={{
              fontSize: 8,
              fontWeight: 600,
              color: C.muted,
              backgroundColor: C.light,
              padding: '2px 6px',
              borderRadius: 6,
            }}
          >
            {day.windowStart} – {day.windowEnd}
          </span>
        </div>
      </div>

      <div>
        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1;
          if (segment.kind === 'gap') {
            return (
              <MiniItineraryGapRow
                key={`gap-${segment.startTime}-${idx}`}
                startTime={segment.startTime}
                endTime={segment.endTime}
              />
            );
          }
          return (
            <MiniItineraryItemRow
              key={segment.item.id}
              item={segment.item}
              timeState={resolveItineraryTimeState(segment.item, day.id, { referenceNow })}
              showConnector={!isLast}
            />
          );
        })}
      </div>
    </MiniTripDetailFrame>
  );
}

function MiniChatPreview() {
  return (
    <MiniTripDetailFrame activeTab="chat" tabLabels={TAB_LABELS_ITINERARY}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: AVATAR_COLORS[1],
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}
          >
            R
          </div>
          <div
            style={{
              maxWidth: '75%',
              backgroundColor: C.white,
              borderRadius: '12px 12px 12px 4px',
              padding: '7px 10px',
              boxShadow: `0 2px 8px ${C.shadow}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: C.charcoal,
                fontWeight: 500,
                lineHeight: 1.45,
              }}
            >
              Besok kita berangkat jam 7 ya? Jangan lupa check itinerary 📋
            </p>
          </div>
        </div>

        <div
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 6 }}
        >
          <div
            style={{
              maxWidth: '72%',
              backgroundColor: C.coral,
              borderRadius: '12px 12px 4px 12px',
              padding: '7px 10px',
              boxShadow: `0 2px 10px ${C.coral}40`,
            }}
          >
            <p
              style={{ margin: 0, fontSize: 10, color: 'white', fontWeight: 500, lineHeight: 1.45 }}
            >
              Siap! Undangan udah aku kirim ke yang belum join ✉️
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: AVATAR_COLORS[2],
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}
          >
            B
          </div>
          <div
            style={{
              maxWidth: '68%',
              borderRadius: '12px 12px 12px 4px',
              overflow: 'hidden',
              boxShadow: `0 2px 8px ${C.shadow}`,
            }}
          >
            <img
              src={TRIP_IMAGES.giliBeach}
              alt=""
              style={{ width: '100%', height: 52, objectFit: 'cover', display: 'block' }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: C.charcoal,
                fontWeight: 500,
                padding: '6px 10px',
                backgroundColor: C.white,
                lineHeight: 1.4,
              }}
            >
              Referensi buat besok 📸
            </p>
          </div>
        </div>
      </div>
    </MiniTripDetailFrame>
  );
}

function AppBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 34,
          height: 34,
          backgroundColor: C.coral,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 18px ${C.coral}55`,
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            fill="white"
            stroke="none"
          />
        </svg>
      </div>
      <span style={{ fontSize: 15, fontWeight: 800, color: C.charcoal }}>Atur Perjalanan</span>
    </div>
  );
}

function IntroSlide({ slide }: { slide: Extract<Slide, { kind: 'intro' }> }) {
  return (
    <>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.coral, margin: '0 0 6px' }}>
        Selamat datang
      </p>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.charcoal,
          margin: '0 0 8px',
          letterSpacing: -0.4,
          lineHeight: 1.3,
        }}
      >
        {slide.title}
      </h2>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
        {slide.subtitle}
      </p>
    </>
  );
}

function PairSlide({ slide }: { slide: Extract<Slide, { kind: 'pair' }> }) {
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: C.coral,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {slide.problem.label}
        </span>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: C.charcoal,
            margin: '4px 0 3px',
            lineHeight: 1.35,
          }}
        >
          {slide.problem.title}
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
          {slide.problem.body}
        </p>
      </div>

      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${C.border}, ${C.teal}44, ${C.border})`,
          marginBottom: 14,
        }}
      />

      <div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: C.teal,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {slide.solution.label}
        </span>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: C.charcoal,
            margin: '4px 0 3px',
            lineHeight: 1.35,
          }}
        >
          {slide.solution.title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: C.muted,
            margin: '0 0 12px',
            lineHeight: 1.45,
            fontWeight: 500,
          }}
        >
          {slide.solution.body}
        </p>
        {slide.preview}
      </div>
    </>
  );
}

export function Screen2EduOnboarding() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];
  const isLast = active === SLIDES.length - 1;

  const goNext = () => {
    if (!isLast) setActive((i) => i + 1);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 280,
            overflow: 'hidden',
            backgroundColor: '#C9E8E6',
            flexShrink: 0,
          }}
        >
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.imageAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.98))',
            }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60 }} />
          {active === 0 && (
            <div style={{ position: 'absolute', top: 68, left: 24 }}>
              <AppBadge />
            </div>
          )}
        </div>

        <div style={{ padding: '14px 28px 20px' }}>
          {slide.kind === 'intro' ? <IntroSlide slide={slide} /> : <PairSlide slide={slide} />}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          backgroundColor: C.white,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 16 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? 22 : 7,
                height: 7,
                backgroundColor: i === active ? C.coral : C.border,
                borderRadius: 20,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '0 28px 32px' }}>
          <button
            type="button"
            onClick={goNext}
            style={{
              flex: 1,
              height: 52,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 10px 26px ${C.coral}45`,
              fontFamily: FONT,
            }}
          >
            {isLast ? 'Mulai Sekarang' : 'Selanjutnya →'}
          </button>
        </div>
      </div>
    </div>
  );
}
