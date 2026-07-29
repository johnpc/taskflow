import { describe, it, expect } from 'vitest';
import { groupByFocus } from './groupByFocus';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', myBucket: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('groupByFocus', () => {
  it('orders Today → Upcoming → Later → Unsorted and drops empties', () => {
    const out = groupByFocus([
      task({ id: 'l', myBucket: 'LATER' }),
      task({ id: 't', myBucket: 'TODAY' }),
      task({ id: 'n', myBucket: 'NONE' }),
    ]);
    expect(out.map((b) => b.key)).toEqual(['TODAY', 'LATER', 'NONE']);
  });

  it('treats a missing bucket as Unsorted (NONE)', () => {
    expect(groupByFocus([task({ myBucket: null })]).map((b) => b.key)).toEqual(['NONE']);
  });

  it('excludes done tasks', () => {
    expect(groupByFocus([task({ status: 'DONE', myBucket: 'TODAY' })])).toEqual([]);
  });

  it('sorts within a bucket by due date then title', () => {
    const out = groupByFocus([
      task({ id: 'b', myBucket: 'TODAY', dueDate: '2026-08-10', title: 'B' }),
      task({ id: 'a', myBucket: 'TODAY', dueDate: '2026-08-05', title: 'A' }),
    ]);
    expect(out[0].tasks.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('returns nothing for an empty list', () => {
    expect(groupByFocus([])).toEqual([]);
  });
});
