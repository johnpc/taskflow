import { describe, it, expect } from 'vitest';
import { groupByFocus } from './groupByFocus';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', myBucket: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('groupByFocus', () => {
  it('always returns all four buckets in order (they are drag targets)', () => {
    const out = groupByFocus([
      task({ id: 'l', myBucket: 'LATER' }),
      task({ id: 't', myBucket: 'TODAY' }),
      task({ id: 'n', myBucket: 'NONE' }),
    ]);
    expect(out.map((b) => b.key)).toEqual(['TODAY', 'UPCOMING', 'LATER', 'NONE']);
    // UPCOMING is empty but still present as a drop target.
    expect(out.find((b) => b.key === 'UPCOMING')!.tasks).toEqual([]);
  });

  it('treats a missing bucket as Unsorted (NONE)', () => {
    const out = groupByFocus([task({ myBucket: null })]);
    expect(out.find((b) => b.key === 'NONE')!.tasks.map((t) => t.id)).toEqual(['t']);
  });

  it('excludes done tasks (buckets remain but empty)', () => {
    const out = groupByFocus([task({ status: 'DONE', myBucket: 'TODAY' })]);
    expect(out).toHaveLength(4);
    expect(out.every((b) => b.tasks.length === 0)).toBe(true);
  });

  it('sorts within a bucket by due date then title', () => {
    const out = groupByFocus([
      task({ id: 'b', myBucket: 'TODAY', dueDate: '2026-08-10', title: 'B' }),
      task({ id: 'a', myBucket: 'TODAY', dueDate: '2026-08-05', title: 'A' }),
    ]);
    expect(out[0].tasks.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('returns four empty buckets for an empty list', () => {
    expect(groupByFocus([]).map((b) => b.key)).toEqual(['TODAY', 'UPCOMING', 'LATER', 'NONE']);
  });
});
