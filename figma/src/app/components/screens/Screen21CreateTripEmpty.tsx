import {
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
  getDefaultTripTimes,
} from '../trip/CreateTripParts';

/** [A] Form kosong — state awal buka sheet, tombol aktif; validasi baru muncul setelah tap Buat Perjalanan */
export function Screen21CreateTripEmpty() {
  const { startTime, endTime } = getDefaultTripTimes();

  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        name=""
        tags={[]}
        dateMode="fixed"
        dateMuted
        noDateSelected
        showAddButton
        startTime={startTime}
        endTime={endTime}
      />
    </CreateTripShell>
  );
}
