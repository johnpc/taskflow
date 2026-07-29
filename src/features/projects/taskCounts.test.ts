import { describe, it, expect } from 'vitest';
import { openCountByProject, overdueCount, progressByProject, progressPercent } from './taskCounts';
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

describe('progressByProject', () => {
  it('counts done vs total top-level tasks, excluding subtasks', () => {
    const m = progressByProject([
      task({ id: 'a', projectId: 'p1', status: 'DONE' }),
      task({ id: 'b', projectId: 'p1' }),
      task({ id: 'sub', projectId: 'p1', parentTaskId: 'a', status: 'DONE' }),
      task({ id: 'c', projectId: 'p2' }),
    ]);
    expect(m.get('p1')).toEqual({ done: 1, total: 2 });
    expect(m.get('p2')).toEqual({ done: 0, total: 1 });
  });

  it('omits projects with no top-level tasks', () => {
    const m = progressByProject([task({ id: 'sub', projectId: 'p1', parentTaskId: 'x' })]);
    expect(m.has('p1')).toBe(false);
  });
});

describe('progressPercent', () => {
  it('rounds the done/total ratio, 0 when empty', () => {
    expect(progressPercent({ done: 1, total: 2 })).toBe(50);
    expect(progressPercent({ done: 1, total: 3 })).toBe(33);
    expect(progressPercent({ done: 0, total: 0 })).toBe(0);
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
