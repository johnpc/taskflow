import { describe, it, expect, beforeEach } from 'vitest';
import { readFollowingOnly, writeFollowingOnly } from './followingOnlyStore';

beforeEach(() => localStorage.clear());

describe('followingOnlyStore', () => {
  it('defaults to false', () => {
    expect(readFollowingOnly()).toBe(false);
  });

  it('round-trips the preference', () => {
    writeFollowingOnly(true);
    expect(readFollowingOnly()).toBe(true);
    writeFollowingOnly(false);
    expect(readFollowingOnly()).toBe(false);
  });
});
