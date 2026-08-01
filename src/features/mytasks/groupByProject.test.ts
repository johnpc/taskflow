import { describe, it, expect } from 'vitest';
import { groupByProject } from './groupByProject';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', ...over }) as TaskRecord;

const names: Record<string, string> = { p1: 'Alpha', p2: 'Beta' };
const resolve = (id: string) => names[id];

describe('groupByProject', () => {
  it('buckets open tasks by project name, alphabetically', () => {
    const buckets = groupByProject(
      [
        task({ id: 'a', projectId: 'p2', title: 'B task' }),
        task({ id: 'b', projectId: 'p1', title: 'A task' }),
      ],
      resolve,
    );
    expect(buckets.map((b) => b.label)).toEqual(['Alpha', 'Beta']);
  });

  it('sorts within a bucket by due date then title', () => {
    const buckets = groupByProject(
      [
        task({ id: 'a', projectId: 'p1', title: 'Later', dueDate: '2026-09-01' }),
        task({ id: 'b', projectId: 'p1', title: 'Sooner', dueDate: '2026-08-01' }),
      ],
      resolve,
    );
    expect(buckets[0].tasks.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('falls back to "Other" for unknown projects and drops done tasks', () => {
    const buckets = groupByProject(
      [task({ id: 'a', projectId: 'zzz' }), task({ id: 'b', projectId: 'p1', status: 'DONE' })],
      resolve,
    );
    expect(buckets.map((b) => b.label)).toEqual(['Other']);
    expect(buckets[0].tasks.map((t) => t.id)).toEqual(['a']);
  });
});
