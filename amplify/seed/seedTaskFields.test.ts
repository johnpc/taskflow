import { describe, it, expect } from 'vitest';
import { offsetDate } from './seedTaskFields';
import { todayISO } from '../../src/features/task/today';

describe('offsetDate', () => {
  it('resolves +0 to today in LOCAL time, matching todayISO()', () => {
    // The bug this guards: toISOString() formats in UTC, so in the evening a +0
    // offset seeded "tomorrow" — a due-today anchor the app read as upcoming.
    expect(offsetDate(0)).toBe(todayISO());
  });

  it('returns a valid YYYY-MM-DD string for a future offset', () => {
    expect(offsetDate(5)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
