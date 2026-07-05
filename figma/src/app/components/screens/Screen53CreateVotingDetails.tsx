import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  CreateVotingDetailsForm,
} from '../trip/CreateVotingSheetParts';

/** Sheet buat voting — langkah 2: judul, kandidat, deadline */
export function Screen53CreateVotingDetails() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Detail Voting"
        subtitle="Isi judul dan kandidat yang akan divoting anggota."
        onBack
        footer={<CreateVotingPrimaryButton label="Buat Voting" />}
      >
        <CreateVotingDetailsForm />
      </CreateVotingSheet>
    </div>
  );
}
