import { describe, it, expect } from 'vitest';
import { groupByPriority } from './groupByPriority';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('groupByPriority', () => {
  it('buckets High → None and drops empty buckets', () => {
    const out = groupByPriority([
      task({ id: 'h', priority: 'HIGH' }),
      task({ id: 'l', priority: 'LOW' }),
      task({ id: 'n', priority: 'NONE' }),
    ]);
    expect(out.map((b) => b.key)).toEqual(['HIGH', 'LOW', 'NONE']);
  });

  it('treats a missing priority as None', () => {
    const out = groupByPriority([task({ id: 'x', priority: null })]);
    expect(out.map((b) => b.key)).toEqual(['NONE']);
  });

  it('excludes done tasks', () => {
    expect(groupByPriority([task({ status: 'DONE', priority: 'HIGH' })])).toEqual([]);
  });

  it('sorts within a bucket by due date then title', () => {
    const out = groupByPriority([
      task({ id: 'b', priority: 'HIGH', dueDate: '2026-08-10', title: 'B' }),
      task({ id: 'a', priority: 'HIGH', dueDate: '2026-08-05', title: 'A' }),
    ]);
    expect(out[0].tasks.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('returns nothing for an empty list', () => {
    expect(groupByPriority([])).toEqual([]);
  });
});
