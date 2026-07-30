import { describe, it, expect } from 'vitest';
import { statusMeta, STATUS_META } from './projectStatus';

describe('projectStatus', () => {
  it('maps each status to a label and color token', () => {
    expect(statusMeta('ON_TRACK')).toMatchObject({ label: 'On track', colorVar: '--tf-done' });
    expect(statusMeta('AT_RISK')?.label).toBe('At risk');
    expect(statusMeta('OFF_TRACK')?.colorVar).toBe('--tf-danger');
  });

  it('returns null for no/unknown status', () => {
    expect(statusMeta(null)).toBeNull();
    expect(statusMeta(undefined)).toBeNull();
    expect(statusMeta('BOGUS')).toBeNull();
  });

  it('exposes the three statuses in on→off order', () => {
    expect(STATUS_META.map((m) => m.value)).toEqual(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']);
  });
});
