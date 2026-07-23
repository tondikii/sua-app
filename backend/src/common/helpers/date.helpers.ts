/** Format Date or null as YYYY-MM-DD string or null. */
export function toDateOnly(date: Date | null): string | null {
  return date ? date.toISOString().split('T')[0] : null;
}

/** Format Date or null as HH:MM string (wall-clock time) or null. */
export function toTime(date: Date | null): string | null {
  return date ? new Date(date).toTimeString().slice(0, 5) : null;
}

/** Format Date as HH:MM string (wall-clock time). */
export function timeToHHMM(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Format Date or null as ISO date string (YYYY-MM-DD) or null. */
export function dateToISO(date: Date | null): string | null {
  return date ? date.toISOString().split('T')[0] : null;
}

/** Parse HH:MM string to Date object (sets hours/minutes on epoch date). */
export function toTimeDate(time?: string): Date | null {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  const d = new Date(0);
  d.setHours(h, m, 0, 0);
  return d;
}
