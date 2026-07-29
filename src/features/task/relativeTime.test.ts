import { describe, it, expect } from 'vitest';
import { relativeTime } from './relativeTime';

const now = Date.parse('2026-07-30T12:00:00Z');

describe('relativeTime', () => {
  it('returns empty for missing/invalid', () => {
    expect(relativeTime(null, now)).toBe('');
    expect(relativeTime('not-a-date', now)).toBe('');
  });

  it('says just now for < 45s', () => {
    expect(relativeTime('2026-07-30T11:59:30Z', now)).toBe('just now');
  });

  it('formats minutes, hours, days', () => {
    expect(relativeTime('2026-07-30T11:30:00Z', now)).toBe('30m ago');
    expect(relativeTime('2026-07-30T09:00:00Z', now)).toBe('3h ago');
    expect(relativeTime('2026-07-28T12:00:00Z', now)).toBe('2d ago');
  });

  it('falls back to a Mon D date beyond a week', () => {
    expect(relativeTime('2026-07-01T12:00:00Z', now)).toMatch(/^[A-Z][a-z]{2} \d+$/);
  });
});
