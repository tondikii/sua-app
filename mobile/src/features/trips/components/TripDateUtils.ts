const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const MONTH_NAMES_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
}

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? '' : '';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, '0')}`;
}

export function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  isAllDay: boolean,
  startTime: string | null,
  endTime: string | null,
  status: string,
): string {
  if (status === 'voting_pending' || (!startDate && !endDate)) {
    return 'Tanggal sedang divoting';
  }

  if (!startDate || !endDate) return '';

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  let dateStr: string;
  if (startDate === endDate) {
    dateStr = `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
  } else if (sameMonth) {
    dateStr = `${start.getDate()}–${end.getDate()} ${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
  } else {
    dateStr = `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`;
  }

  if (isAllDay) {
    return `${dateStr} · Sepanjang hari`;
  }

  if (startTime && endTime) {
    return `${dateStr} · ${formatTime12(startTime)} – ${formatTime12(endTime)}`;
  }

  return dateStr;
}

export function formatNotificationTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

export function getDayLabel(dateStr: string, dayIndex: number): string {
  const date = parseDate(dateStr);
  const dayName = DAY_NAMES[date.getDay()];
  return `Hari ${dayIndex + 1} · ${dayName}, ${date.getDate()} ${MONTH_NAMES_FULL[date.getMonth()]}`;
}

export function getDateMonthYear(dateStr: string): { day: number; month: number; year: number } {
  const d = parseDate(dateStr);
  return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
}

export function getDaysInRange(startDate: string, endDate: string): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const days: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export { MONTH_NAMES, MONTH_NAMES_FULL };
