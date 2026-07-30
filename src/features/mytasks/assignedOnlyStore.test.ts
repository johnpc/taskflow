import { describe, it, expect, beforeEach } from 'vitest';
import { readAssignedOnly, writeAssignedOnly } from './assignedOnlyStore';

beforeEach(() => localStorage.clear());

describe('assignedOnlyStore', () => {
  it('defaults to false', () => {
    expect(readAssignedOnly()).toBe(false);
  });

  it('round-trips the preference', () => {
    writeAssignedOnly(true);
    expect(readAssignedOnly()).toBe(true);
    writeAssignedOnly(false);
    expect(readAssignedOnly()).toBe(false);
  });
});
