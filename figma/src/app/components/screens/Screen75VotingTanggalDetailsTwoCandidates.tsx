import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** Kembali ke detail: 2 kandidat tersimpan, tenggat muncul */
export function Screen75VotingTanggalDetailsTwoCandidates() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Detail Voting Tanggal"
        subtitle="Kandidat kedua sudah disimpan. Tenggat opsional — tambah kandidat lagi jika perlu."
        onBack
        footer={<CreateVotingPrimaryButton label="Buat Voting" />}
      >
        <CreateVotingTanggalDetailsForm
          candidates={[TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES[1]]}
          showAddButton
          highlightAddButton
        />
      </CreateVotingSheet>
    </div>
  );
}
