import { describe, it, expect } from 'vitest';
import { openCountByProject, overdueCount } from './taskCounts';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    projectId: 'p',
    status: 'TODO',
    dueDate: null,
    parentTaskId: null,
    ...over,
  }) as TaskRecord;

describe('openCountByProject', () => {
  it('counts open top-level tasks per project', () => {
    const m = openCountByProject([
      task({ id: 'a', projectId: 'p1' }),
      task({ id: 'b', projectId: 'p1' }),
      task({ id: 'c', projectId: 'p2' }),
    ]);
    expect(m.get('p1')).toBe(2);
    expect(m.get('p2')).toBe(1);
  });

  it('excludes done tasks and subtasks', () => {
    const m = openCountByProject([
      task({ id: 'a', projectId: 'p1', status: 'DONE' }),
      task({ id: 'sub', projectId: 'p1', parentTaskId: 'a' }),
      task({ id: 'b', projectId: 'p1' }),
    ]);
    expect(m.get('p1')).toBe(1);
  });
});

describe('overdueCount', () => {
  const today = '2026-07-30';
  it('counts open overdue tasks', () => {
    expect(
      overdueCount(
        [
          task({ id: 'a', dueDate: '2026-07-01' }),
          task({ id: 'b', dueDate: '2026-07-01', status: 'DONE' }),
          task({ id: 'c', dueDate: '2026-08-30' }),
          task({ id: 'd', dueDate: null }),
        ],
        today,
      ),
    ).toBe(1);
  });
});
