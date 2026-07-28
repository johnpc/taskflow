import { describe, it, expect } from 'vitest';
import { isDone, dueStatus, dueLabel, PRIORITY_META } from './taskMeta';

describe('isDone', () => {
  it('is true only for DONE', () => {
    expect(isDone({ status: 'DONE' })).toBe(true);
    expect(isDone({ status: 'TODO' })).toBe(false);
    expect(isDone({ status: null })).toBe(false);
  });
});

describe('dueStatus', () => {
  const today = '2026-07-28';
  it('returns none when no date', () => {
    expect(dueStatus(null, today, false)).toBe('none');
  });
  it('returns today for the same day', () => {
    expect(dueStatus('2026-07-28', today, false)).toBe('today');
  });
  it('returns overdue for a past date when not done', () => {
    expect(dueStatus('2026-07-01', today, false)).toBe('overdue');
  });
  it('past dates on a done task are not overdue', () => {
    expect(dueStatus('2026-07-01', today, true)).toBe('upcoming');
  });
  it('returns upcoming for a future date', () => {
    expect(dueStatus('2026-08-15', today, false)).toBe('upcoming');
  });
});

describe('dueLabel', () => {
  const today = '2026-07-28';
  it('is blank with no date', () => {
    expect(dueLabel(null, today)).toBe('');
  });
  it('labels today and overdue', () => {
    expect(dueLabel('2026-07-28', today)).toBe('Today');
    expect(dueLabel('2026-07-01', today)).toBe('Overdue');
  });
  it('formats a future date as Mon D', () => {
    expect(dueLabel('2026-08-03', today)).toBe('Aug 3');
  });
});

describe('PRIORITY_META', () => {
  it('has a label + token for every priority', () => {
    for (const key of ['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const) {
      expect(PRIORITY_META[key].label).toBeTruthy();
      expect(PRIORITY_META[key].token).toBeTruthy();
    }
  });
});
