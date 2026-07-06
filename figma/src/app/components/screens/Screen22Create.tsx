import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [A] Tanggal pasti — default terisi draft, waktu custom */
export function Screen22Create() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody dateMode="fixed" startTime="08:00" endTime="17:00" />
    </CreateTripShell>
  );
}
