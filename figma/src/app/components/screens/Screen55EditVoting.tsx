import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  CreateVotingDetailsForm,
} from '../trip/CreateVotingSheetParts';

/** Sheet edit voting — dari menu ⋮ → Edit Voting */
export function Screen55EditVoting() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        height="fixed"
        title="Edit Voting"
        subtitle="Ubah judul, kandidat, atau deadline voting ini."
        footer={<CreateVotingPrimaryButton label="Simpan" />}
      >
        <CreateVotingDetailsForm />
      </CreateVotingSheet>
    </div>
  );
}
