import { useState, type ReactNode } from 'react';
import { C, FONT } from '../colors';

const IMAGES = {
  intro: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=700&fit=crop&auto=format',
  voting: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=700&fit=crop&auto=format',
  destinations: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=700&fit=crop&auto=format',
  collaboration: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=700&fit=crop&auto=format',
};

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
    title: 'Liburan bareng, jadi nyata',
    subtitle:
      'Ketahui bagaimana Atur Perjalanan membantumu—dari wacana di grup chat jadi rencana yang benar-benar jalan.',
  },
  {
    kind: 'pair',
    image: IMAGES.voting,
    imageAlt: 'Perencanaan jadwal liburan',
    problem: {
      label: 'Masalah',
      title: 'Kutukan "Wacana" & Bentrok Jadwal',
      body: 'Diskusi panjang, tanggal nggak pernah fix, rencana sering batal.',
    },
    solution: {
      label: 'Solusi',
      title: 'Penentuan Tanggal Fleksibel',
      body: 'Ajukan kandidat tanggal, semua vote, lalu kunci jadwal final.',
    },
    preview: <MiniVotingPreview />,
  },
  {
    kind: 'pair',
    image: IMAGES.destinations,
    imageAlt: 'Destinasi liburan',
    problem: {
      label: 'Masalah',
      title: 'Inspirasi yang Tercecer',
      body: 'Link TikTok & Instagram hilang atau tenggelam di obrolan grup.',
    },
    solution: {
      label: 'Solusi',
      title: 'Pusat Informasi & Referensi',
      body: 'Destinasi rapi dengan peta dan link referensi di satu tempat.',
    },
    preview: <MiniDestinationsPreview />,
  },
  {
    kind: 'pair',
    image: IMAGES.collaboration,
    imageAlt: 'Teman berkoordinasi lewat ponsel',
    problem: {
      label: 'Masalah',
      title: 'Koordinasi Tercecer',
      body: 'Diskusi tercampur chat harian, undangan & info jadwal masih manual.',
    },
    solution: {
      label: 'Solusi',
      title: 'Group Chat per Perjalanan',
      body: 'Chat khusus tiap trip, undang via username/email + sync kalender.',
    },
    preview: <MiniChatPreview />,
  },
];

function MiniVotingPreview() {
  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: `0 4px 16px ${C.shadow}`,
        border: `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.charcoal }}>15 – 18 Jun 2026</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, backgroundColor: C.tealLight, padding: '3px 8px', borderRadius: 8 }}>
          4 suara
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {['R', 'B', 'A', 'D'].map((l, i) => (
          <div
            key={l}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFB347', '#8B7CF6'][i],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: 'white',
              marginLeft: i > 0 ? -6 : 0,
              border: '2px solid white',
            }}
          >
            {l}
          </div>
        ))}
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginLeft: 4 }}>Vote tanggal favorit</span>
      </div>
    </div>
  );
}

function MiniDestinationsPreview() {
  const items = [
    { emoji: '🏖️', name: 'Pantai Tiga Warna', tag: 'Maps' },
    { emoji: '🌄', name: 'Bukit Merese', tag: 'TikTok' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((d) => (
        <div
          key={d.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: C.white,
            borderRadius: 12,
            padding: '10px 12px',
            boxShadow: `0 2px 12px ${C.shadow}`,
            border: `1px solid ${C.border}`,
          }}
        >
          <span style={{ fontSize: 20 }}>{d.emoji}</span>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: C.charcoal }}>{d.name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, backgroundColor: C.tealLight, padding: '3px 7px', borderRadius: 6 }}>
            {d.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniChatPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ alignSelf: 'flex-start', maxWidth: '78%', backgroundColor: C.white, borderRadius: '14px 14px 14px 4px', padding: '8px 12px', boxShadow: `0 2px 10px ${C.shadow}` }}>
        <p style={{ margin: 0, fontSize: 11, color: C.charcoal, fontWeight: 500, lineHeight: 1.45 }}>Yuk vote tanggalnya di tab Voting 🗳️</p>
      </div>
      <div style={{ alignSelf: 'flex-end', maxWidth: '72%', backgroundColor: C.coral, borderRadius: '14px 14px 4px 14px', padding: '8px 12px' }}>
        <p style={{ margin: 0, fontSize: 11, color: 'white', fontWeight: 500, lineHeight: 1.45 }}>Udah aku undang Sari & Budi ✉️</p>
      </div>
    </div>
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
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" stroke="none" />
        </svg>
      </div>
      <span style={{ fontSize: 15, fontWeight: 800, color: C.charcoal }}>Atur Perjalanan</span>
    </div>
  );
}

function IntroSlide({ slide }: { slide: Extract<Slide, { kind: 'intro' }> }) {
  return (
    <>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.coral, margin: '0 0 6px' }}>Selamat datang</p>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.charcoal, margin: '0 0 8px', letterSpacing: -0.5, lineHeight: 1.28 }}>
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
        <span style={{ fontSize: 10, fontWeight: 800, color: C.coral, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {slide.problem.label}
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: '4px 0 3px', lineHeight: 1.3 }}>
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
        <span style={{ fontSize: 10, fontWeight: 800, color: C.teal, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {slide.solution.label}
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: '4px 0 3px', lineHeight: 1.3 }}>
          {slide.solution.title}
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px', lineHeight: 1.45, fontWeight: 500 }}>
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
      {/* Hero — 46% */}
      <div style={{ flex: '0 0 46%', position: 'relative', overflow: 'hidden', backgroundColor: '#C9E8E6' }}>
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

      {/* Content */}
      <div style={{ flex: 1, padding: '14px 28px 32px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {slide.kind === 'intro' ? <IntroSlide slide={slide} /> : <PairSlide slide={slide} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, margin: '12px 0 16px', flexShrink: 0 }}>
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

        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
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
