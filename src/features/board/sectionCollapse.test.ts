import { describe, it, expect, beforeEach } from 'vitest';
import { readCollapsed, writeCollapsed } from './sectionCollapse';

describe('sectionCollapse store', () => {
  beforeEach(() => localStorage.clear());

  it('falls back when there is no stored value', () => {
    expect(readCollapsed('s1', true)).toBe(true);
    expect(readCollapsed('s1', false)).toBe(false);
  });

  it('round-trips a collapsed choice per section', () => {
    writeCollapsed('s1', true);
    expect(readCollapsed('s1', false)).toBe(true);
    writeCollapsed('s1', false);
    expect(readCollapsed('s1', true)).toBe(false);
    // Other sections are unaffected.
    expect(readCollapsed('s2', true)).toBe(true);
  });
});
