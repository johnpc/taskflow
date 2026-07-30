import { describe, it, expect } from 'vitest';
import { assigneeInitials } from './assigneeInitials';

describe('assigneeInitials', () => {
  it('takes the first letter of each of the first two name parts', () => {
    expect(assigneeInitials('ada.lovelace@x.co')).toBe('AL');
    expect(assigneeInitials('grace-hopper@x.co')).toBe('GH');
    expect(assigneeInitials('alan_turing@x.co')).toBe('AT');
  });

  it('takes the first two letters of a single-part name', () => {
    expect(assigneeInitials('grace@x.co')).toBe('GR');
  });

  it('returns empty for a blank assignee', () => {
    expect(assigneeInitials(null)).toBe('');
    expect(assigneeInitials(undefined)).toBe('');
    expect(assigneeInitials('')).toBe('');
  });
});
