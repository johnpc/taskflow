import { describe, it, expect } from 'vitest';
import { repeats, nextDueDate } from './recurrence';

describe('recurrence', () => {
  it('repeats() is true only for an active rule', () => {
    expect(repeats('WEEKLY')).toBe(true);
    expect(repeats('NONE')).toBe(false);
    expect(repeats(null)).toBe(false);
    expect(repeats(undefined)).toBe(false);
  });

  it('advances daily and weekly', () => {
    expect(nextDueDate('2026-07-28', 'DAILY')).toBe('2026-07-29');
    expect(nextDueDate('2026-07-28', 'WEEKLY')).toBe('2026-08-04');
  });

  it('advances monthly on the same day', () => {
    expect(nextDueDate('2026-07-15', 'MONTHLY')).toBe('2026-08-15');
  });

  it('clamps a monthly roll to the last valid day', () => {
    expect(nextDueDate('2026-01-31', 'MONTHLY')).toBe('2026-02-28');
    expect(nextDueDate('2028-01-31', 'MONTHLY')).toBe('2028-02-29'); // leap year
  });

  it('rolls a daily step across a month boundary', () => {
    expect(nextDueDate('2026-07-31', 'DAILY')).toBe('2026-08-01');
  });

  it('returns null with no date or no active rule', () => {
    expect(nextDueDate(null, 'WEEKLY')).toBeNull();
    expect(nextDueDate('2026-07-28', 'NONE')).toBeNull();
    expect(nextDueDate('2026-07-28', null)).toBeNull();
  });
});
