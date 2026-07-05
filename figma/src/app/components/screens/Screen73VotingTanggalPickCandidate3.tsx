import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  VotingTanggalCalendarPicker,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

const CANDIDATE_3 = TRIP_DATE_CANDIDATES[2];

/** Kandidat 3 terpilih, 2 sudah tersimpan */
export function Screen73VotingTanggalPickCandidate3() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Tambah Kandidat Tanggal"
        subtitle="Dua kandidat tersimpan. Pilih rentang ketiga lalu simpan."
        onBack
        footer={<CreateVotingPrimaryButton label="Simpan Kandidat" />}
      >
        <VotingTanggalCalendarPicker
          savedCandidates={[TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES[1]]}
          activeCandidate={CANDIDATE_3}
          highlightAddButton
          allDay={false}
        />
      </CreateVotingSheet>
    </div>
  );
}
