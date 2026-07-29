import { describe, it, expect, beforeEach } from 'vitest';
import { readShowCompleted, writeShowCompleted } from './showCompletedStore';

describe('showCompletedStore', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to false', () => {
    expect(readShowCompleted()).toBe(false);
  });

  it('round-trips the preference', () => {
    writeShowCompleted(true);
    expect(readShowCompleted()).toBe(true);
    writeShowCompleted(false);
    expect(readShowCompleted()).toBe(false);
  });
});
