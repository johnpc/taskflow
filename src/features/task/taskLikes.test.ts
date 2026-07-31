import { describe, it, expect } from 'vitest';
import { hasLiked, likeCount, toggleLike } from './taskLikes';

describe('taskLikes', () => {
  it('hasLiked is case-insensitive and null-safe', () => {
    expect(hasLiked(['A@x.co'], 'a@x.co')).toBe(true);
    expect(hasLiked(['b@x.co'], 'a@x.co')).toBe(false);
    expect(hasLiked(null, 'a@x.co')).toBe(false);
    expect(hasLiked([null, ' a@x.co '], 'A@X.CO')).toBe(true);
  });

  it('likeCount ignores null/blank entries', () => {
    expect(likeCount(['a@x.co', 'b@x.co'])).toBe(2);
    expect(likeCount([null, '', 'a@x.co'])).toBe(1);
    expect(likeCount(null)).toBe(0);
  });

  it('toggleLike adds me when absent', () => {
    expect(toggleLike(['b@x.co'], 'a@x.co')).toEqual(['b@x.co', 'a@x.co']);
    expect(toggleLike(null, 'a@x.co')).toEqual(['a@x.co']);
  });

  it('toggleLike removes me when present (case-insensitive), keeping others', () => {
    expect(toggleLike(['b@x.co', 'A@x.co'], 'a@x.co')).toEqual(['b@x.co']);
  });

  it('toggleLike strips null/blank noise from the stored list', () => {
    expect(toggleLike([null, '', 'b@x.co'], 'a@x.co')).toEqual(['b@x.co', 'a@x.co']);
  });
});
