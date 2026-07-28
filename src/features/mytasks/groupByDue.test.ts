import { describe, it, expect } from 'vitest';
import { groupByDue } from './groupByDue';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', dueDate: null, ...over }) as TaskRecord;
const today = '2026-07-28';

describe('groupByDue', () => {
  it('buckets by due status and drops empty buckets', () => {
    const out = groupByDue(
      [
        task({ id: 'o', dueDate: '2026-07-01' }),
        task({ id: 't', dueDate: '2026-07-28' }),
        task({ id: 'u', dueDate: '2026-08-10' }),
        task({ id: 'n', dueDate: null }),
      ],
      today,
    );
    expect(out.map((b) => b.key)).toEqual(['overdue', 'today', 'upcoming', 'noDate']);
  });

  it('excludes done tasks', () => {
    const out = groupByDue([task({ id: 'd', status: 'DONE', dueDate: '2026-07-01' })], today);
    expect(out).toEqual([]);
  });

  it('sorts within a bucket by due date then title', () => {
    const out = groupByDue(
      [
        task({ id: 'b', dueDate: '2026-08-10', title: 'B' }),
        task({ id: 'a', dueDate: '2026-08-05', title: 'A' }),
      ],
      today,
    );
    const upcoming = out.find((b) => b.key === 'upcoming')!;
    expect(upcoming.tasks.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('returns nothing for an empty list', () => {
    expect(groupByDue([], today)).toEqual([]);
  });
});
