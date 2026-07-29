import { describe, it, expect } from 'vitest';
import { completedBucket } from './completedBucket';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'T',
    status: 'TODO',
    parentTaskId: null,
    completedAt: null,
    ...over,
  }) as TaskRecord;

describe('completedBucket', () => {
  it('returns a Completed bucket of done top-level tasks, newest first', () => {
    const out = completedBucket([
      task({ id: 'a', status: 'DONE', completedAt: '2026-01-01' }),
      task({ id: 'b', status: 'DONE', completedAt: '2026-03-01' }),
      task({ id: 'open', status: 'TODO' }),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].key).toBe('completed');
    expect(out[0].tasks.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('excludes done subtasks', () => {
    const out = completedBucket([task({ id: 's', status: 'DONE', parentTaskId: 'p' })]);
    expect(out).toEqual([]);
  });

  it('returns nothing when no tasks are done', () => {
    expect(completedBucket([task({ status: 'TODO' })])).toEqual([]);
  });
});
