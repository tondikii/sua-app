import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE } from '../trip/CreateTripParts';

/** Awal: 1 kandidat default (tanggal perjalanan saat ini) */
export function Screen61CreateVotingTanggalDetails() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Detail Voting Tanggal"
        subtitle="Kandidat default = tanggal perjalanan saat ini. Tap Tambah Kandidat untuk opsi lain."
        onBack
        footer={<CreateVotingPrimaryButton label="Buat Voting" />}
      >
        <CreateVotingTanggalDetailsForm
          candidates={[TRIP_CURRENT_DATE_CANDIDATE]}
          showAddButton
          highlightAddButton
        />
      </CreateVotingSheet>
    </div>
  );
}
