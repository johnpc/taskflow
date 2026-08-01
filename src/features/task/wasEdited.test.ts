import { describe, it, expect } from 'vitest';
import { wasEdited } from './wasEdited';

describe('wasEdited', () => {
  it('is false when updatedAt ≈ createdAt (create round-trip)', () => {
    expect(wasEdited('2026-08-01T10:00:00.000Z', '2026-08-01T10:00:00.500Z')).toBe(false);
  });

  it('is true when updatedAt is well after createdAt', () => {
    expect(wasEdited('2026-08-01T10:00:00Z', '2026-08-01T10:05:00Z')).toBe(true);
  });

  it('is false for missing or unparseable timestamps', () => {
    expect(wasEdited(null, '2026-08-01T10:05:00Z')).toBe(false);
    expect(wasEdited('2026-08-01T10:00:00Z', undefined)).toBe(false);
    expect(wasEdited('nope', 'also-nope')).toBe(false);
  });
});
