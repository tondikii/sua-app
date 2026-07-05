import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
} from '../trip/CreateVotingSheetParts';
import { TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** 3 kandidat + tenggat, siap buat voting */
export function Screen74VotingTanggalDetailsComplete() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Detail Voting Tanggal"
        subtitle="Semua kandidat tersimpan. Tenggat opsional sebelum membuat voting."
        onBack
        footer={<CreateVotingPrimaryButton label="Buat Voting" />}
      >
        <CreateVotingTanggalDetailsForm
          candidates={TRIP_DATE_CANDIDATES}
          deadline="18 Jun 2026, 18:00"
          showAddButton={false}
        />
      </CreateVotingSheet>
    </div>
  );
}
