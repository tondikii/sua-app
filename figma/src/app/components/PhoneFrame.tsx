import { FONT } from './colors';

interface PhoneFrameProps {
  label: string;
  index: number;
  children: React.ReactNode;
}

export function PhoneFrame({ label, index, children }: PhoneFrameProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 390,
          height: 844,
          background: 'linear-gradient(170deg, #2A2A2A 0%, #1A1A1A 100%)',
          borderRadius: 54,
          padding: 14,
          boxShadow: [
            '0 60px 120px rgba(0,0,0,0.35)',
            '0 20px 50px rgba(0,0,0,0.25)',
            '0 0 0 1px rgba(255,255,255,0.12) inset',
            '0 0 0 0.5px rgba(0,0,0,0.6)',
          ].join(', '),
          position: 'relative',
        }}
      >
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: -3,
            top: 140,
            width: 4,
            height: 76,
            background: '#333',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3,
            top: 120,
            width: 4,
            height: 44,
            background: '#333',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3,
            top: 176,
            width: 4,
            height: 44,
            background: '#333',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3,
            top: 232,
            width: 4,
            height: 44,
            background: '#333',
            borderRadius: 3,
          }}
        />

        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 42,
            overflow: 'hidden',
            position: 'relative',
            fontFamily: FONT,
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 126,
              height: 36,
              backgroundColor: '#1A1A1A',
              borderRadius: 22,
              zIndex: 1000,
            }}
          />
          {children}
        </div>
      </div>

      <div style={{ textAlign: 'center', fontFamily: FONT }}>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          Layar {index}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 700, color: '#4B5563' }}>
          {label}
        </p>
      </div>
    </div>
  );
}
