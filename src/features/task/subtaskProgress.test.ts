import { describe, it, expect } from 'vitest';
import { subtaskProgressByParent } from './subtaskProgress';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', status: 'TODO', parentTaskId: null, ...over }) as TaskRecord;

describe('subtaskProgressByParent', () => {
  it('counts done vs total per parent', () => {
    const m = subtaskProgressByParent([
      task({ id: 'p' }),
      task({ id: 's1', parentTaskId: 'p', status: 'DONE' }),
      task({ id: 's2', parentTaskId: 'p', status: 'TODO' }),
      task({ id: 's3', parentTaskId: 'p', status: 'DONE' }),
    ]);
    expect(m.get('p')).toEqual({ done: 2, total: 3 });
  });

  it('omits tasks with no subtasks', () => {
    const m = subtaskProgressByParent([task({ id: 'p' })]);
    expect(m.has('p')).toBe(false);
  });

  it('is empty for no tasks', () => {
    expect(subtaskProgressByParent([]).size).toBe(0);
  });
});
