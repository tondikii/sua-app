import { getReminderTargets, dueTarget } from './reminder-horizons';

describe('reminder-horizons', () => {
  const ANCHOR = new Date('2026-07-26T10:00:00Z');

  it('computes R1 at 50% and R2 at 25% of the gap anchored at the anchor', () => {
    const deadline = new Date(ANCHOR.getTime() + 14 * 24 * 60 * 60 * 1000);
    const [r1, r2] = getReminderTargets(deadline, ANCHOR);

    expect(r1.type).toBe('r1');
    expect(r1.at.getTime()).toBe(deadline.getTime() - 7 * 24 * 60 * 60 * 1000);
    expect(r2.type).toBe('r2');
    expect(r2.at.getTime()).toBe(deadline.getTime() - 3.5 * 24 * 60 * 60 * 1000);
  });

  it('applies min lead of 30m for R1 and 5m for R2 on short deadlines', () => {
    const deadline = new Date(ANCHOR.getTime() + 30 * 60 * 1000); // 30 min away
    const [r1, r2] = getReminderTargets(deadline, ANCHOR);

    expect(r1.at.getTime()).toBe(deadline.getTime() - 30 * 60 * 1000);
    // R2: gap×0.25 = 7.5m > MIN_LEAD 5m → lead = 7.5m → target = ANCHOR + 22.5m
    expect(r2.at.getTime()).toBe(ANCHOR.getTime() + 22.5 * 60 * 1000);
  });

  it('uses new Date() as the default anchor', () => {
    jest.useFakeTimers();
    jest.setSystemTime(ANCHOR);
    const deadline = new Date(ANCHOR.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [r1] = getReminderTargets(deadline);
    expect(r1.at.getTime()).toBe(deadline.getTime() - 3.5 * 24 * 60 * 60 * 1000);
    jest.useRealTimers();
  });

  it('drops targets at or before the anchor (deadline too close to lead)', () => {
    const deadline = new Date(ANCHOR.getTime() + 60 * 1000); // 1 min away
    // R2 would be deadline − 5m < anchor → dropped; R1 = deadline − 30m < anchor → dropped.
    expect(getReminderTargets(deadline, ANCHOR)).toEqual([]);
  });

  it('returns r1 before r2, and both strictly between anchor and deadline', () => {
    const deadline = new Date(ANCHOR.getTime() + 3 * 24 * 60 * 60 * 1000);
    const targets = getReminderTargets(deadline, ANCHOR);
    expect(targets.map((t) => t.type)).toEqual(['r1', 'r2']);
    for (const t of targets) {
      expect(t.at.getTime()).toBeGreaterThan(ANCHOR.getTime());
      expect(t.at.getTime()).toBeLessThan(deadline.getTime());
    }
  });

  it('dueTarget returns the reminder type when the target falls in the next hour', () => {
    const deadline = new Date(ANCHOR.getTime() + 7 * 24 * 60 * 60 * 1000);
    const targets = getReminderTargets(deadline, ANCHOR);
    // r1 target = deadline − 3.5d = ANCHOR + 3.5d
    const now = new Date(ANCHOR.getTime() + 3.5 * 24 * 60 * 60 * 1000);
    expect(dueTarget(targets, now)).toBe('r1');
  });

  it('dueTarget returns null when no target falls in the next hour', () => {
    const deadline = new Date(ANCHOR.getTime() + 7 * 24 * 60 * 60 * 1000);
    const targets = getReminderTargets(deadline, ANCHOR);
    // far from both targets
    expect(dueTarget(targets, ANCHOR)).toBeNull();
  });
});
