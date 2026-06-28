import { ArrowLeft, MoreHorizontal, AlertTriangle, Lock, ThumbsUp } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const candidates = [
  {
    id: 1,
    range: '15 – 18 Jun 2026',
    days: '4 hari',
    votes: 4,
    avatars: ['R', 'B', 'A', 'D'],
    voted: true,
  },
  {
    id: 2,
    range: '22 – 25 Jun 2026',
    days: '4 hari',
    votes: 2,
    avatars: ['S', 'M'],
    voted: false,
  },
  {
    id: 3,
    range: '1 – 4 Jul 2026',
    days: '4 hari',
    votes: 1,
    avatars: ['R'],
    voted: false,
  },
];

export function Screen6Voting() {
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
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Lombok Weekend Escape</h2>
          <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>Voting Tanggal</p>
        </div>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MoreHorizontal size={18} color={C.charcoal} />
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ display: 'flex', margin: '16px 20px 0', borderBottom: `1.5px solid ${C.border}` }}>
        {[
          { label: 'Destinasi', active: false },
          { label: 'Voting', active: true },
          { label: 'Chat', active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 12,
              paddingTop: 2,
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

      {/* Coral alert banner */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: C.coral,
          borderRadius: 16,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <AlertTriangle size={18} color="white" fill="rgba(255,255,255,0.3)" strokeWidth={2.5} />
        <div>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 800, margin: 0 }}>Butuh Voting Tanggal</p>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12, margin: '2px 0 0', fontWeight: 500 }}>
            4 dari 5 anggota belum memilih
          </p>
        </div>
      </div>

      {/* Candidate cards */}
      <div style={{ flex: 1, padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {candidates.map((cand) => (
          <div
            key={cand.id}
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              padding: '16px',
              boxShadow: cand.voted ? `0 4px 20px ${C.coral}25, 0 0 0 1.5px ${C.coral}` : `0 4px 20px ${C.shadow}`,
              border: cand.voted ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.2 }}>{cand.range}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>✈️ {cand.days} perjalanan</p>
              </div>
              <div
                style={{
                  backgroundColor: cand.voted ? C.coralLight : C.light,
                  color: cand.voted ? C.coral : C.muted,
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '5px 12px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ThumbsUp size={12} strokeWidth={2.5} />
                {cand.votes} suara
              </div>
            </div>

            {/* Voter avatars + Vote button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {cand.avatars.map((init, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      borderRadius: '50%',
                      border: '2px solid white',
                      marginLeft: i > 0 ? -10 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      color: 'white',
                      zIndex: 10 - i,
                    }}
                  >
                    {init}
                  </div>
                ))}
                {cand.votes > 0 && (
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: 10, fontWeight: 500 }}>sudah memilih</span>
                )}
              </div>

              {cand.voted ? (
                <div
                  style={{
                    backgroundColor: C.tealLight,
                    color: C.teal,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '7px 14px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  ✓ Voted
                </div>
              ) : (
                <button
                  style={{
                    backgroundColor: C.white,
                    color: C.charcoal,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '7px 16px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  Vote
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '16px 20px 28px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        <button
          style={{
            width: '100%',
            height: 54,
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 10px 28px ${C.coral}45`,
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Lock size={16} strokeWidth={2.5} />
          Kunci Tanggal Ini
        </button>
      </div>
    </div>
  );
}
