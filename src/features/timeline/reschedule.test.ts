import { describe, it, expect } from 'vitest';
import { reschedulePatch } from './reschedule';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'x', status: 'TODO', ...over }) as TaskRecord;

describe('reschedulePatch', () => {
  it('moves the due date to the dropped day', () => {
    expect(reschedulePatch(task({ dueDate: '2026-08-01' }), '2026-08-05')).toEqual({
      id: 't',
      dueDate: '2026-08-05',
    });
  });

  it('shifts the start date by the same delta to preserve the span', () => {
    const patch = reschedulePatch(
      task({ dueDate: '2026-08-03', startDate: '2026-08-01' }),
      '2026-08-06',
    );
    expect(patch).toEqual({ id: 't', dueDate: '2026-08-06', startDate: '2026-08-04' });
  });

  it('returns null when the day is unchanged or the task has no due date', () => {
    expect(reschedulePatch(task({ dueDate: '2026-08-01' }), '2026-08-01')).toBeNull();
    expect(reschedulePatch(task({ dueDate: null }), '2026-08-01')).toBeNull();
  });
});
