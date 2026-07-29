import { describe, it, expect } from 'vitest';
import { addDays, duePresets } from './duePresets';

describe('addDays', () => {
  it('adds days across month/year boundaries', () => {
    expect(addDays('2026-07-30', 1)).toBe('2026-07-31');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-07-30', 7)).toBe('2026-08-06');
  });
});

describe('duePresets', () => {
  it('offers today, tomorrow, next week', () => {
    const p = duePresets('2026-07-30');
    expect(p.map((x) => x.key)).toEqual(['today', 'tomorrow', 'nextWeek']);
    expect(p.map((x) => x.date)).toEqual(['2026-07-30', '2026-07-31', '2026-08-06']);
  });
});
