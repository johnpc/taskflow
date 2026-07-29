import { describe, it, expect } from 'vitest';
import { horizonDates } from './horizon';

describe('horizonDates', () => {
  it('lists count days from the start inclusive', () => {
    expect(horizonDates('2026-07-30', 3)).toEqual(['2026-07-30', '2026-07-31', '2026-08-01']);
  });

  it('rolls over month + year boundaries', () => {
    expect(horizonDates('2026-12-31', 2)).toEqual(['2026-12-31', '2027-01-01']);
  });

  it('returns a single day for count 1', () => {
    expect(horizonDates('2026-07-30', 1)).toEqual(['2026-07-30']);
  });
});
