import { describe, it, expect } from 'vitest';
import { isFollowing, followerCount, toggleFollow } from './followState';

describe('taskFollowers', () => {
  it('isFollowing is case-insensitive and null-safe', () => {
    expect(isFollowing(['Me@x.co'], 'me@x.co')).toBe(true);
    expect(isFollowing(null, 'me@x.co')).toBe(false);
  });

  it('followerCount ignores null/blank', () => {
    expect(followerCount([null, '', 'a@x.co'])).toBe(1);
  });

  it('toggleFollow adds then removes the current user', () => {
    expect(toggleFollow(['b@x.co'], 'a@x.co')).toEqual(['b@x.co', 'a@x.co']);
    expect(toggleFollow(['b@x.co', 'a@x.co'], 'a@x.co')).toEqual(['b@x.co']);
  });
});
