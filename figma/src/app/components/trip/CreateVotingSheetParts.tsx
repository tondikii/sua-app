import type { ReactNode } from 'react';
import { ChevronLeft, CalendarDays } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomSheet, SheetPrimaryButton, SHEET_SAFE_TOP } from '../ui/BottomSheet';
import { AddCandidateButton } from '../ui/AddCandidateButton';
import {
  TRIP_DATE_CANDIDATES,
  type TripDateCandidate,
  TripDateSection,
  TripDateCandidateList,
  AddCandidateDateButton,
  TRIP_DATE_PENDING,
} from './CreateTripParts';
import { ITINERARY_VOTING_CANDIDATES, ITINERARY_VOTING_TITLE } from './ItineraryParts';
import { TripDetailHeader } from './TripDetailParts';
import { VOTING_TYPE_META, type VotingType } from './VotingParts';

export const VOTING_TYPE_DESCRIPTIONS: Record<VotingType, string> = {
  tanggal: 'Untuk menentukan tanggal perjalanan jika ada konflik ketersediaan tanggal anggota.',
  destinasi: 'Untuk memilih aktivitas atau destinasi di slot itinerary.',
  lainnya: 'Keputusan custom — transportasi, akomodasi, dll.',
};

export const CREATE_VOTING_TITLE = 'Buat Voting';
export const CREATE_VOTING_TYPE_SUBTITLE =
  'Pilih jenis voting yang akan diputuskan bersama anggota.';

export const CREATE_VOTING_DETAILS_TITLE = 'Detail Voting';
export const CREATE_VOTING_DETAILS_SUBTITLE = 'Isi judul dan kandidat yang akan divoting anggota.';
export const CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE =
  'Tambahkan kandidat tanggal perjalanan yang akan divoting anggota.';

export const CREATE_VOTING_TANGGAL_ADD_TITLE = 'Tambah Kandidat Tanggal';
export const CREATE_VOTING_TANGGAL_ADD_SUBTITLE =
  'Pilih rentang tanggal di kalender, lalu simpan sebagai kandidat.';

export const EDIT_VOTING_TITLE = 'Edit Voting';
export const EDIT_VOTING_SUBTITLE = 'Ubah judul, kandidat, atau tenggat voting ini.';
export const EDIT_VOTING_TANGGAL_SUBTITLE = 'Ubah kandidat tanggal atau tenggat voting ini.';

export function CreateVotingBackdrop({ subtitle = TRIP_DATE_PENDING }: { subtitle?: string }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: C.white,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <TripDetailHeader title="Lombok Weekend Escape" subtitle={subtitle} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,46,0.45)',
          zIndex: 10,
        }}
      />
    </>
  );
}

type CreateVotingSheetProps = {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  children: ReactNode;
  footer: ReactNode;
  /** auto = tinggi ikut konten; fixed = tinggi penuh area aman, body scrollable */
  height?: 'auto' | 'fixed';
};

/** Bottom sheet buat voting — wrapper shared BottomSheet */
export function CreateVotingSheet({
  title,
  subtitle,
  onBack,
  children,
  footer,
  height = 'auto',
}: CreateVotingSheetProps) {
  return (
    <BottomSheet title={title} subtitle={subtitle} onBack={onBack} footer={footer} height={height}>
      {children}
    </BottomSheet>
  );
}

export function CreateVotingPrimaryButton({ label }: { label: string }) {
  return <SheetPrimaryButton label={label} />;
}

// Re-export for consumers that import SHEET_SAFE_TOP
export { SHEET_SAFE_TOP };

type VotingTypeOptionListProps = {
  selected?: VotingType;
  disabledTypes?: VotingType[];
  /** Hanya tipe di sini yang menampilkan badge "Sedang berlangsung" saat disabled */
  ongoingTypes?: VotingType[];
};

export function VotingTypeOptionList({
  selected = 'destinasi',
  disabledTypes = ['tanggal'],
  ongoingTypes = [],
}: VotingTypeOptionListProps) {
  const types: VotingType[] = ['tanggal', 'destinasi', 'lainnya'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, margin: '0 0 2px' }}>
        Pilih jenis voting
      </p>
      {types.map((type) => {
        const meta = VOTING_TYPE_META[type];
        const Icon = meta.icon;
        const disabled = disabledTypes.includes(type);
        const isSelected = type === selected;
        return (
          <button
            key={type}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              backgroundColor: isSelected ? meta.bg : C.white,
              border: isSelected ? `2px solid ${meta.color}` : `1.5px solid ${C.border}`,
              borderRadius: 16,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
              opacity: disabled ? 0.55 : 1,
              boxShadow: isSelected ? `0 0 0 3px ${meta.bg}` : 'none',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                backgroundColor: meta.bg,
                borderRadius: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={19} color={meta.color} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: 0 }}>
                  {meta.label}
                </p>
                {disabled && ongoingTypes.includes(type) && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.muted,
                      backgroundColor: C.light,
                      padding: '2px 8px',
                      borderRadius: 8,
                    }}
                  >
                    Sedang berlangsung
                  </span>
                )}
              </div>
              <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0', lineHeight: 1.45 }}>
                {VOTING_TYPE_DESCRIPTIONS[type]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function VotingFormField({
  label,
  value,
  placeholder,
  required,
  optional,
  leftIcon,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  leftIcon?: ReactNode;
}) {
  const filled = Boolean(value);

  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
        {required && <span style={{ color: C.coral }}> *</span>}
        {optional && (
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginLeft: 4 }}>
            (opsional)
          </span>
        )}
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: filled ? C.light : C.white,
          borderRadius: 14,
          padding: '13px 16px',
          border: filled ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
          boxShadow: filled ? `0 0 0 3px ${C.coralLight}` : 'none',
          fontSize: filled ? 15 : 14,
          fontWeight: filled ? 500 : 400,
          color: filled ? C.charcoal : C.mutedLight,
        }}
      >
        {leftIcon && <span style={{ flexShrink: 0, display: 'flex' }}>{leftIcon}</span>}
        <span style={{ flex: 1 }}>{value || placeholder}</span>
      </div>
    </div>
  );
}

export function VotingCandidateChips({ items }: { items: string[] }) {
  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        Kandidat <span style={{ color: C.coral }}>*</span>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              backgroundColor: C.light,
              borderRadius: 12,
              border: `1.5px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                border: `2px solid ${C.coral}`,
                backgroundColor: C.coralLight,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{item}</span>
          </div>
        ))}
        <AddCandidateButton compact />
      </div>
    </div>
  );
}

export function VotingTypeBadgeInline({ type }: { type: VotingType }) {
  const meta = VOTING_TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: 'fit-content',
        flexShrink: 0,
        gap: 5,
        backgroundColor: meta.bg,
        color: meta.color,
        fontSize: 11,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 20,
        marginBottom: 14,
      }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

export function VotingDateCandidateChips({
  candidates = [TRIP_DATE_CANDIDATES[0]],
  showAddButton = false,
  highlightAddButton = false,
  candidateInfoOpen = false,
}: {
  candidates?: TripDateCandidate[];
  showAddButton?: boolean;
  highlightAddButton?: boolean;
  candidateInfoOpen?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <TripDateCandidateList savedCandidates={candidates} hideLabel />
      {showAddButton && (
        <AddCandidateDateButton
          compact
          highlighted={highlightAddButton}
          infoTooltipOpen={candidateInfoOpen}
        />
      )}
    </div>
  );
}

type VotingTanggalCalendarPickerProps = {
  savedCandidates?: TripDateCandidate[];
  activeCandidate?: TripDateCandidate;
  highlightAddButton?: boolean;
  candidateInfoOpen?: boolean;
  showCandidateList?: boolean;
  showTime?: boolean;
  allDay?: boolean;
};

/** Picker kalender — selaras §5: kalender → waktu → tombol kandidat → daftar */
export function VotingTanggalCalendarPicker({
  savedCandidates = [],
  activeCandidate,
  highlightAddButton = true,
  candidateInfoOpen = false,
  showCandidateList = true,
  showTime = true,
  allDay,
}: VotingTanggalCalendarPickerProps) {
  const active = activeCandidate ?? TRIP_DATE_CANDIDATES[1];
  const resolvedAllDay = allDay ?? active.timeLabel === 'Sepanjang hari';
  const showList = showCandidateList && (savedCandidates.length > 0 || activeCandidate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TripDateSection
        selectedStart={active.start}
        selectedEnd={active.end}
        compact
        dateMode="candidates"
        showAddButton
        highlightAddButton={highlightAddButton}
        showTime={showTime}
        allDay={resolvedAllDay}
        candidateInfoOpen={candidateInfoOpen}
      />

      {showList && (
        <TripDateCandidateList
          savedCandidates={savedCandidates}
          activeCandidate={activeCandidate}
        />
      )}
    </div>
  );
}

type CreateVotingDetailsFormProps = {
  title?: string;
  candidates?: string[];
  deadline?: string;
  type?: VotingType;
};

/** Form detail voting — dipakai buat & edit */
export function CreateVotingDetailsForm({
  title = ITINERARY_VOTING_TITLE,
  candidates = ITINERARY_VOTING_CANDIDATES,
  deadline = '20 Jun 2026, 23:59',
  type = 'destinasi',
}: CreateVotingDetailsFormProps) {
  return (
    <>
      <VotingTypeBadgeInline type={type} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <VotingFormField
          label="Judul Voting"
          value={title}
          placeholder="Contoh: Kulineran siang · Hari 1"
          required
        />

        <VotingCandidateChips items={candidates} />

        <VotingFormField
          label="Tenggat"
          value={deadline}
          placeholder="Pilih tanggal & waktu..."
          optional
          leftIcon={<CalendarDays size={16} color={C.muted} strokeWidth={2.5} />}
        />
      </div>
    </>
  );
}

/** Form buat voting tanggal — selaras §5, tenggat muncul jika ≥1 kandidat */
export function CreateVotingTanggalDetailsForm({
  deadline,
  candidates = [TRIP_DATE_CANDIDATES[0]],
  showAddButton = true,
  highlightAddButton = false,
}: {
  deadline?: string;
  candidates?: TripDateCandidate[];
  showAddButton?: boolean;
  highlightAddButton?: boolean;
}) {
  const showTenggat = candidates.length >= 1;

  return (
    <>
      <VotingTypeBadgeInline type="tanggal" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.charcoal,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Kandidat Tanggal <span style={{ color: C.coral }}>*</span>
          </label>
          <VotingDateCandidateChips
            candidates={candidates}
            showAddButton={showAddButton}
            highlightAddButton={highlightAddButton}
          />
        </div>

        {showTenggat && (
          <VotingFormField
            label="Tenggat"
            value={deadline}
            placeholder="Pilih tanggal & waktu..."
            optional
            leftIcon={<CalendarDays size={16} color={C.muted} strokeWidth={2.5} />}
          />
        )}
      </div>
    </>
  );
}

/** Layar sheet buat/edit voting — backdrop + bottom sheet */
export function CreateVotingScreen({
  title,
  subtitle,
  onBack,
  footer,
  height = 'auto',
  backdropSubtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  footer: ReactNode;
  height?: 'auto' | 'fixed';
  backdropSubtitle?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop subtitle={backdropSubtitle} />
      <CreateVotingSheet
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        footer={footer}
        height={height}
      >
        {children}
      </CreateVotingSheet>
    </div>
  );
}

/** Sheet tambah kandidat tanggal voting */
export function VotingTanggalPickCandidateScreen({
  savedCandidates,
  activeCandidate,
  allDay = false,
}: {
  savedCandidates: TripDateCandidate[];
  activeCandidate: TripDateCandidate;
  allDay?: boolean;
}) {
  return (
    <CreateVotingScreen
      height="fixed"
      title={CREATE_VOTING_TANGGAL_ADD_TITLE}
      subtitle={CREATE_VOTING_TANGGAL_ADD_SUBTITLE}
      onBack
      footer={<CreateVotingPrimaryButton label="Simpan Kandidat" />}
    >
      <VotingTanggalCalendarPicker
        savedCandidates={savedCandidates}
        activeCandidate={activeCandidate}
        highlightAddButton
        allDay={allDay}
      />
    </CreateVotingScreen>
  );
}
