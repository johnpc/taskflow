import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readCollapsed,
  writeCollapsed,
  setManyCollapsed,
  areAllCollapsed,
  subscribeCollapse,
} from './sectionCollapse';

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

  it('notifies subscribers on write, and unsubscribes cleanly', () => {
    const listener = vi.fn();
    const off = subscribeCollapse(listener);
    writeCollapsed('s1', true);
    expect(listener).toHaveBeenCalledTimes(1);
    off();
    writeCollapsed('s1', false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('sets many at once and reports all-collapsed', () => {
    const listener = vi.fn();
    subscribeCollapse(listener);
    setManyCollapsed(['a', 'b', 'c'], true);
    expect(listener).toHaveBeenCalledTimes(1); // one notify for the batch
    expect(areAllCollapsed(['a', 'b', 'c'], true)).toBe(true);
    setManyCollapsed(['b'], false);
    expect(areAllCollapsed(['a', 'b', 'c'], true)).toBe(false);
  });

  it('areAllCollapsed is false for an empty id list', () => {
    expect(areAllCollapsed([], true)).toBe(false);
  });
});
