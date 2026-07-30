import { describe, it, expect } from 'vitest';
import { addMember, removeMember, normalizeEmail, isValidEmail } from './memberList';

describe('memberList', () => {
  it('normalizes emails (trim + lowercase)', () => {
    expect(normalizeEmail('  Me@X.CO ')).toBe('me@x.co');
  });

  it('validates email shape', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('nope')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
  });

  it('adds a normalized email, ignoring case-insensitive duplicates', () => {
    expect(addMember(['owner@x.co'], '  Alice@X.co ')).toEqual(['owner@x.co', 'alice@x.co']);
    expect(addMember(['owner@x.co', 'alice@x.co'], 'ALICE@x.co')).toEqual([
      'owner@x.co',
      'alice@x.co',
    ]);
  });

  it('removes a member but never the owner (first entry)', () => {
    expect(removeMember(['owner@x.co', 'alice@x.co'], 'alice@x.co')).toEqual(['owner@x.co']);
    expect(removeMember(['owner@x.co', 'alice@x.co'], 'owner@x.co')).toEqual([
      'owner@x.co',
      'alice@x.co',
    ]);
  });
});
