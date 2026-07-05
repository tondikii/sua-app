import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [B] Setelah tap Tambah Kandidat — mode belum pasti, belum ada kandidat tersimpan */
export function Screen70CreateTripUncertainDate() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody dateMode="candidates" />
    </CreateTripShell>
  );
}
