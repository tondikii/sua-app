/** Format Date or null as YYYY-MM-DD string or null. */
export function toDateOnly(date: Date | null): string | null {
  return date ? date.toISOString().split('T')[0] : null;
}

/** Format Date or null as HH:MM string (wall-clock time, UTC — matches Prisma @db.Time round-trip) or null. */
export function toTime(date: Date | null): string | null {
  return date ? timeToHHMM(new Date(date)) : null;
}

/** Format Date as HH:MM string (wall-clock time, UTC — matches Prisma @db.Time round-trip). */
export function timeToHHMM(date: Date): string {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Format Date or null as ISO date string (YYYY-MM-DD) or null. */
export function dateToISO(date: Date | null): string | null {
  return date ? date.toISOString().split('T')[0] : null;
}

/** Parse HH:MM string to Date object (UTC, matching Prisma's @db.Time round-trip). */
export function toTimeDate(time?: string): Date | null {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
}
