import { describe, it, expect } from 'vitest';
import { assigneeOptions } from './assigneeOptions';

describe('assigneeOptions', () => {
  it('drops null/blank members', () => {
    expect(assigneeOptions([null, '', 'a@x.co'], null)).toEqual(['a@x.co']);
  });

  it('ensures the current user is present (solo self-assign)', () => {
    expect(assigneeOptions(['a@x.co'], 'me@x.co')).toEqual(['a@x.co', 'me@x.co']);
  });

  it('does not duplicate the current user when already a member', () => {
    expect(assigneeOptions(['me@x.co', 'a@x.co'], 'me@x.co')).toEqual(['me@x.co', 'a@x.co']);
  });

  it('handles no members + no current user', () => {
    expect(assigneeOptions(null, null)).toEqual([]);
  });
});
