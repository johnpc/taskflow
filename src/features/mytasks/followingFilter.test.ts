import { describe, it, expect } from 'vitest';
import { filterFollowing } from './followingFilter';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', ...over }) as TaskRecord;

describe('filterFollowing', () => {
  const tasks = [
    task({ id: 'a', followers: ['me@x.co'] }),
    task({ id: 'b', followers: ['you@x.co'] }),
    task({ id: 'c', followers: [] }),
  ];

  it('returns all when off', () => {
    expect(filterFollowing(tasks, 'me@x.co', false)).toHaveLength(3);
  });

  it('returns all when there is no email', () => {
    expect(filterFollowing(tasks, null, true)).toHaveLength(3);
  });

  it('keeps only tasks the user follows when on', () => {
    expect(filterFollowing(tasks, 'me@x.co', true).map((t) => t.id)).toEqual(['a']);
  });
});
