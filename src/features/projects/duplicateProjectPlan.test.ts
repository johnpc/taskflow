import { describe, it, expect } from 'vitest';
import { copyTaskInput, tasksToCopy } from './duplicateProjectPlan';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', ...over }) as TaskRecord;

describe('duplicateProjectPlan', () => {
  it('copyTaskInput retargets the project/section and keeps the title verbatim', () => {
    const input = copyTaskInput(
      task({ title: 'Design', priority: 'HIGH', dueDate: '2030-01-01', labelIds: ['l1'] }),
      'p2',
      's2',
    );
    expect(input).toMatchObject({
      projectId: 'p2',
      sectionId: 's2',
      title: 'Design',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '2030-01-01',
      labelIds: ['l1'],
    });
  });

  it('tasksToCopy keeps only open, top-level tasks', () => {
    const kept = tasksToCopy([
      task({ id: 'a' }),
      task({ id: 'b', status: 'DONE' }),
      task({ id: 'c', parentTaskId: 'a' }),
    ]);
    expect(kept.map((t) => t.id)).toEqual(['a']);
  });
});
