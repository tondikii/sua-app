import { X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { C, FONT } from '../colors';

const ERROR_RED = '#E53935';
const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const JUNE_DAYS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];

export function Screen27FormValidation() {
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
      <div style={{ height: 60 }} />

      {/* Modal header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>Buat Perjalanan</h2>
        <div style={{ width: 36 }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Nama Perjalanan — ERROR STATE */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: ERROR_RED, display: 'block', marginBottom: 8 }}>
            Nama Perjalanan <span style={{ color: ERROR_RED }}>*</span>
          </label>
          <div
            style={{
              backgroundColor: '#FFF5F5',
              borderRadius: 14,
              padding: '14px 16px',
              border: `2px solid ${ERROR_RED}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: `0 0 0 4px rgba(229,57,53,0.08)`,
            }}
          >
            <span style={{ fontSize: 15, color: '#C0BFBF', fontWeight: 400, flex: 1 }}>
              Masukkan nama perjalanan...
            </span>
            <AlertCircle size={17} color={ERROR_RED} strokeWidth={2.5} />
          </div>
          {/* Error message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2 }}>
            <AlertCircle size={12} color={ERROR_RED} strokeWidth={2.5} />
            <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>
              Nama perjalanan tidak boleh kosong.
            </span>
          </div>
        </div>

        {/* Tags — normal state */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>Tags</label>
          <div
            style={{
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '12px 14px',
              border: `1.5px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 50,
            }}
          >
            <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah tag...</span>
          </div>
        </div>

        {/* Calendar — normal */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
            Pilih Tanggal
          </label>
          <div style={{ backgroundColor: C.white, borderRadius: 18, border: `1.5px solid ${C.border}`, padding: '14px 14px 10px', boxShadow: `0 3px 14px ${C.shadow}` }}>
            {/* Month nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '0 2px' }}>
              <div style={{ width: 30, height: 30, backgroundColor: C.light, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={16} color={C.muted} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.charcoal }}>Juni 2026</span>
              <div style={{ width: 30, height: 30, backgroundColor: C.light, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={16} color={C.muted} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
              {DAY_HEADERS.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: C.muted, paddingBottom: 4 }}>{d}</div>
              ))}
            </div>

            {JUNE_DAYS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {week.map((day, di) => {
                  if (!day) return <div key={di} />;
                  return (
                    <div key={di} style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: C.mutedLight }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Candidate date button */}
          <button
            style={{
              width: '100%', height: 44,
              backgroundColor: 'transparent',
              border: `2px dashed ${C.border}`,
              borderRadius: 14,
              fontSize: 13, fontWeight: 600, color: C.mutedLight,
              cursor: 'pointer', marginTop: 10, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            + Tambah Kandidat Tanggal
          </button>
        </div>
      </div>

      {/* Sticky CTA — DISABLED */}
      <div style={{ padding: '16px 20px 28px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        {/* Error summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#FFF5F5',
            border: `1px solid rgba(229,57,53,0.25)`,
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 12,
          }}
        >
          <AlertCircle size={14} color={ERROR_RED} strokeWidth={2.5} />
          <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>1 kolom wajib belum diisi</span>
        </div>
        <button
          style={{
            width: '100%', height: 54,
            backgroundColor: '#C8C8D4',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 16, fontWeight: 800,
            cursor: 'not-allowed',
            fontFamily: FONT,
            boxShadow: 'none',
          }}
          disabled
        >
          Buat Perjalanan
        </button>
      </div>
    </div>
  );
}
