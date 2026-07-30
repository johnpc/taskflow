import { describe, it, expect } from 'vitest';
import { confettiPieces } from './confettiPieces';

describe('confettiPieces', () => {
  it('builds the requested count deterministically', () => {
    const a = confettiPieces(12);
    const b = confettiPieces(12);
    expect(a).toHaveLength(12);
    expect(a).toEqual(b);
  });

  it('keeps every piece within bounds and cycles colors', () => {
    const pieces = confettiPieces(20);
    for (const p of pieces) {
      expect(p.left).toBeGreaterThanOrEqual(0);
      expect(p.left).toBeLessThanOrEqual(100);
      expect(p.duration).toBeGreaterThan(0);
      expect(p.color).toContain('var(');
    }
  });
});
