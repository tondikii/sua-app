import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  VotingTanggalCalendarPicker,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

const CANDIDATE_2 = TRIP_DATE_CANDIDATES[1];

/** Kandidat 2 terpilih di kalender, belum disimpan (1 tersimpan) */
export function Screen62CreateVotingTanggalPickCandidate() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Tambah Kandidat Tanggal"
        subtitle="Kalender → waktu → Simpan Kandidat. Kandidat default sudah tersimpan di bawah."
        onBack
        footer={<CreateVotingPrimaryButton label="Simpan Kandidat" />}
      >
        <VotingTanggalCalendarPicker
          savedCandidates={[TRIP_CURRENT_DATE_CANDIDATE]}
          activeCandidate={CANDIDATE_2}
          highlightAddButton
          allDay={false}
        />
      </CreateVotingSheet>
    </div>
  );
}
