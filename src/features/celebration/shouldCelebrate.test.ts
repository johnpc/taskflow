import { describe, it, expect } from 'vitest';
import { shouldCelebrate } from './shouldCelebrate';

describe('shouldCelebrate', () => {
  it('never celebrates a non-positive count', () => {
    expect(shouldCelebrate(0)).toBe(false);
    expect(shouldCelebrate(-3)).toBe(false);
  });

  it('celebrates the first completion, then every 5th', () => {
    expect(shouldCelebrate(1)).toBe(true);
    expect(shouldCelebrate(2)).toBe(false);
    expect(shouldCelebrate(5)).toBe(true);
    expect(shouldCelebrate(6)).toBe(false);
    expect(shouldCelebrate(10)).toBe(true);
  });
});
