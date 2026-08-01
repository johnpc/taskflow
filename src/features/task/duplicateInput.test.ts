import { describe, it, expect } from 'vitest';
import { duplicateInput, subtaskCopyInput } from './duplicateInput';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', projectId: 'p', title: 'Plan', status: 'DONE', ...over }) as TaskRecord;

describe('duplicateInput', () => {
  it('copies fields into a fresh TODO with "(copy)" and the given order', () => {
    const out = duplicateInput(
      task({
        sectionId: 's',
        title: 'Plan',
        notes: 'n',
        priority: 'HIGH',
        startDate: '2026-08-01',
        dueDate: '2026-08-05',
        dueTime: '09:00',
        repeat: 'WEEKLY',
        isMilestone: true,
        labelIds: ['l1', null],
        customValues: '{"f1":"v"}',
      }),
      3,
    );
    expect(out).toMatchObject({
      projectId: 'p',
      sectionId: 's',
      title: 'Plan (copy)',
      notes: 'n',
      status: 'TODO',
      priority: 'HIGH',
      startDate: '2026-08-01',
      dueDate: '2026-08-05',
      dueTime: '09:00',
      repeat: 'WEEKLY',
      isMilestone: true,
      labelIds: ['l1'],
      customValues: '{"f1":"v"}',
      sortOrder: 3,
    });
  });

  it('defaults missing optional fields', () => {
    const out = duplicateInput(task({ priority: null, repeat: null }), 0);
    expect(out.priority).toBe('NONE');
    expect(out.repeat).toBe('NONE');
    expect(out.isMilestone).toBe(false);
    expect(out.labelIds).toEqual([]);
  });

  it('subtaskCopyInput parents a fresh TODO child (no "(copy)" suffix)', () => {
    const out = subtaskCopyInput(
      task({ title: 'Step one', priority: 'LOW', dueDate: '2026-08-02', sortOrder: 2 }),
      'newParent',
      'p',
    );
    expect(out).toMatchObject({
      projectId: 'p',
      parentTaskId: 'newParent',
      title: 'Step one',
      status: 'TODO',
      priority: 'LOW',
      dueDate: '2026-08-02',
      sortOrder: 2,
    });
  });
});
