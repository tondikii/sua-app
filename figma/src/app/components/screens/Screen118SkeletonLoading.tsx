import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

export function Screen118SkeletonLoading() {
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
      <style>{`
        @keyframes ap-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ap-sk {
          background: linear-gradient(90deg, #F0F0F6 0%, #E4E4EE 45%, #F0F0F6 100%);
          background-size: 250% 100%;
          animation: ap-shimmer 1.6s ease infinite;
        }
      `}</style>

      <div style={{ height: 60 }} />

      {/* Header skeleton — bell area */}
      <div style={{ padding: '4px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <div className="ap-sk" style={{ width: 30, height: 30, borderRadius: '50%' }} />
      </div>

      {/* Title skeleton */}
      <div style={{ padding: '14px 22px 0' }}>
        <div className="ap-sk" style={{ width: 148, height: 20, borderRadius: 8 }} />
      </div>

      {/* Tab skeleton */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          margin: '18px 22px 0',
          paddingBottom: 14,
          borderBottom: `1.5px solid ${C.border}`,
          alignItems: 'center',
        }}
      >
        <div className="ap-sk" style={{ width: 78, height: 13, borderRadius: 6 }} />
        <div className="ap-sk" style={{ width: 52, height: 13, borderRadius: 6 }} />
        <div className="ap-sk" style={{ width: 68, height: 13, borderRadius: 6 }} />
      </div>

      {/* Skeleton trip cards */}
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            margin: '20px 22px 0',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: C.white,
            boxShadow: `0 4px 20px ${C.shadow}`,
          }}
        >
          {/* Image skeleton */}
          <div className="ap-sk" style={{ height: 148, borderRadius: 0 }} />

          {/* Content skeleton */}
          <div style={{ padding: '14px 16px 16px', backgroundColor: C.white }}>
            {/* Title */}
            <div className="ap-sk" style={{ width: '72%', height: 15, borderRadius: 7, marginBottom: 12 }} />

            {/* Tag chips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div className="ap-sk" style={{ width: 64, height: 24, borderRadius: 20 }} />
              <div className="ap-sk" style={{ width: 56, height: 24, borderRadius: 20 }} />
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="ap-sk" style={{ width: 110, height: 11, borderRadius: 6 }} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="ap-sk"
                    style={{
                      width: 26, height: 26,
                      borderRadius: '50%',
                      marginLeft: j > 1 ? -9 : 0,
                      border: '2px solid white',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '20px 0 0',
        }}
      >
        <div
          style={{
            width: 16, height: 16,
            border: `2.5px solid ${C.coral}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Memuat perjalananmu...</span>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
