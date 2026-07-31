import { describe, it, expect } from 'vitest';
import { approvalMeta, approvalOf, APPROVAL_OPTIONS } from './approval';

describe('approval', () => {
  it('approvalMeta returns null for NONE/unset', () => {
    expect(approvalMeta('NONE')).toBeNull();
    expect(approvalMeta(null)).toBeNull();
    expect(approvalMeta(undefined)).toBeNull();
  });

  it('approvalMeta maps each outcome to a label + color var', () => {
    expect(approvalMeta('APPROVED')).toEqual({ label: 'Approved', colorVar: '--tf-done' });
    expect(approvalMeta('CHANGES_REQUESTED')?.label).toBe('Changes requested');
    expect(approvalMeta('REJECTED')?.colorVar).toBe('--tf-danger');
  });

  it('approvalOf normalizes null to NONE', () => {
    expect(approvalOf(null)).toBe('NONE');
    expect(approvalOf('APPROVED')).toBe('APPROVED');
  });

  it('offers four picker options starting with No approval', () => {
    expect(APPROVAL_OPTIONS).toHaveLength(4);
    expect(APPROVAL_OPTIONS[0]).toEqual({ value: 'NONE', label: 'No approval' });
  });
});
