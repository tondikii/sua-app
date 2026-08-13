/** Format a Date as "HH:MM" (24h). */
export function formatHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Current wall-clock time as "HH:MM". */
export function nowTime(): string {
  return formatHHMM(new Date());
}

/** Current time + 1 hour as "HH:MM" (rolls over midnight). */
export function nowPlusOneHour(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return formatHHMM(d);
}

/** Convenience pair: [now, now+1h] for start/end time defaults. */
export function defaultTimeRange(): { start: string; end: string } {
  return { start: nowTime(), end: nowPlusOneHour() };
}
