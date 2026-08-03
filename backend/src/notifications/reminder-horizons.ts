/**
 * Reminder Horizons — proportional reminder scheduling
 *
 * Instead of hardcoded absolute horizons (H-7d / H-1d / H-1h), each reminder
 * target is computed as a fraction of the total gap between the `anchor`
 * (when the deadline/trip start was last set — `trip.updatedAt`) and the
 * deadline itself, clamped by an absolute minimum lead time so reminders
 * never fire after the deadline:
 *
 *   R1 target = deadline − max(gap × 0.50, 30 min)
 *   R2 target = deadline − max(gap × 0.25,  5 min)
 *
 * Because the gap is measured from the anchor (not from each cron run), the
 * targets are stable: a 14-day deadline gets R1 at H-7d and R2 at H-3.5d,
 * while a 30-minute deadline still lands R1 immediately and R2 before it
 * passes. Moving the deadline later (which bumps `updatedAt`) naturally
 * reschedules any reminder that has not been sent yet.
 *
 * The cron runs every hour; a reminder is due when its target falls within
 * the next hour of the current run.
 */
export interface ReminderTarget {
  type: 'r1' | 'r2';
  at: Date;
}

const FRACTIONS: Record<'r1' | 'r2', number> = {
  r1: 0.5,
  r2: 0.25,
};

const MIN_LEAD_MS: Record<'r1' | 'r2', number> = {
  r1: 30 * 60 * 1000, // 30 minutes
  r2: 5 * 60 * 1000, // 5 minutes
};

export const REMINDER_ORDER: ('r1' | 'r2')[] = ['r1', 'r2'];

const HOUR_MS = 60 * 60 * 1000;

/**
 * Compute reminder targets for a deadline, anchoring the gap at `anchor`.
 * Targets at or before the anchor (deadline too close to ever lead) are
 * dropped.
 */
export function getReminderTargets(
  deadline: Date,
  anchor: Date = new Date(),
): ReminderTarget[] {
  const targets: ReminderTarget[] = [];
  const gap = deadline.getTime() - anchor.getTime();

  for (const type of REMINDER_ORDER) {
    const lead = Math.max(gap * FRACTIONS[type], MIN_LEAD_MS[type]);
    const at = new Date(deadline.getTime() - lead);
    if (at.getTime() >= anchor.getTime()) {
      targets.push({ type, at });
    }
  }

  return targets;
}

/**
 * Check whether a reminder target falls within the next hour of `now`
 * (the current cron run). Returns the reminder type when due, else null.
 */
export function dueTarget(
  targets: ReminderTarget[],
  now: Date,
): 'r1' | 'r2' | null {
  const start = now.getTime();
  const end = start + HOUR_MS;
  for (const t of targets) {
    const atMs = t.at.getTime();
    if (atMs >= start && atMs < end) return t.type;
  }
  return null;
}
