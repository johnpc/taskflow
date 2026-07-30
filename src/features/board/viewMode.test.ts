import { describe, it, expect, beforeEach } from 'vitest';
import { readViewMode, writeViewMode } from './viewMode';

describe('viewMode store', () => {
  beforeEach(() => localStorage.clear());

  it('falls back to the provided default', () => {
    expect(readViewMode('p1', 'LIST')).toBe('LIST');
    expect(readViewMode('p1')).toBe('BOARD');
  });

  it('round-trips a stored choice per project', () => {
    writeViewMode('p1', 'LIST');
    expect(readViewMode('p1', 'BOARD')).toBe('LIST');
    // Other projects are unaffected.
    expect(readViewMode('p2', 'BOARD')).toBe('BOARD');
  });

  it('ignores a garbage stored value', () => {
    localStorage.setItem('tf-view-p1', 'weird');
    expect(readViewMode('p1', 'BOARD')).toBe('BOARD');
  });

  it('round-trips the TIMELINE view', () => {
    writeViewMode('p1', 'TIMELINE');
    expect(readViewMode('p1', 'BOARD')).toBe('TIMELINE');
  });
});
