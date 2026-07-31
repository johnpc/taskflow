import { describe, it, expect } from 'vitest';
import {
  isDone,
  dueStatus,
  dueLabel,
  formatTime,
  dueLabelWithTime,
  startsInFuture,
  startLabel,
  PRIORITY_META,
} from './taskMeta';

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
  it('labels tomorrow with a friendly word', () => {
    expect(dueLabel('2026-07-29', today)).toBe('Tomorrow');
  });
  it('crosses month boundaries for tomorrow', () => {
    expect(dueLabel('2026-08-01', '2026-07-31')).toBe('Tomorrow');
  });
  it('formats a further-out date as Mon D', () => {
    expect(dueLabel('2026-08-03', today)).toBe('Aug 3');
  });
});

describe('formatTime', () => {
  it('formats 24h HH:MM as a 12h clock', () => {
    expect(formatTime('09:00')).toBe('9:00 AM');
    expect(formatTime('14:05')).toBe('2:05 PM');
    expect(formatTime('00:30')).toBe('12:30 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
  });
  it('is blank for empty/malformed values', () => {
    expect(formatTime(null)).toBe('');
    expect(formatTime('')).toBe('');
    expect(formatTime('nope')).toBe('');
  });
});

describe('dueLabelWithTime', () => {
  const today = '2026-07-28';
  it('appends the time to the date label', () => {
    expect(dueLabelWithTime('2026-07-28', '09:00', today)).toBe('Today 9:00 AM');
    expect(dueLabelWithTime('2026-08-03', '14:00', today)).toBe('Aug 3 2:00 PM');
  });
  it('falls back to the plain date label without a time', () => {
    expect(dueLabelWithTime('2026-08-03', null, today)).toBe('Aug 3');
  });
  it('is blank with no date even if a time is set', () => {
    expect(dueLabelWithTime(null, '09:00', today)).toBe('');
  });
});

describe('startsInFuture', () => {
  const today = '2026-07-28';
  it('is true only for a future start on an open task', () => {
    expect(startsInFuture('2026-08-01', today, false)).toBe(true);
    expect(startsInFuture('2026-07-28', today, false)).toBe(false); // today = started
    expect(startsInFuture('2026-07-01', today, false)).toBe(false); // past
    expect(startsInFuture('2026-08-01', today, true)).toBe(false); // done
    expect(startsInFuture(null, today, false)).toBe(false);
  });
});

describe('startLabel', () => {
  const today = '2026-07-28';
  it('labels a future start "Starts Mon D"', () => {
    expect(startLabel('2026-08-03', today)).toBe('Starts Aug 3');
  });
  it('is blank for today, past, or no start', () => {
    expect(startLabel('2026-07-28', today)).toBe('');
    expect(startLabel('2026-07-01', today)).toBe('');
    expect(startLabel(null, today)).toBe('');
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
