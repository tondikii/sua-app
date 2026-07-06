import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [B] Tooltip info di dalam tombol Tambah Kandidat (pressed) */
export function Screen26CreateTripUncertainInfo() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody dateMode="candidates" candidateInfoOpen />
    </CreateTripShell>
  );
}
