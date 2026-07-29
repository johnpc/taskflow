import { describe, it, expect } from 'vitest';
import { homeSummary } from './homeSummary';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'T',
    status: 'TODO',
    dueDate: null,
    parentTaskId: null,
    ...over,
  }) as TaskRecord;
const today = '2026-07-30';

describe('homeSummary', () => {
  it('splits today / overdue / upcoming and excludes done + subtasks', () => {
    const s = homeSummary(
      [
        task({ id: 'today', dueDate: '2026-07-30' }),
        task({ id: 'over', dueDate: '2026-07-01' }),
        task({ id: 'soon', dueDate: '2026-08-02' }),
        task({ id: 'done', dueDate: '2026-07-30', status: 'DONE' }),
        task({ id: 'sub', dueDate: '2026-07-30', parentTaskId: 'today' }),
      ],
      today,
    );
    expect(s.today.map((t) => t.id)).toEqual(['today']);
    expect(s.overdue).toBe(1);
    expect(s.upcoming.map((t) => t.id)).toEqual(['soon']);
  });

  it('sorts upcoming by due date and limits', () => {
    const s = homeSummary(
      [
        task({ id: 'c', dueDate: '2026-08-10' }),
        task({ id: 'a', dueDate: '2026-08-02' }),
        task({ id: 'b', dueDate: '2026-08-05' }),
      ],
      today,
      2,
    );
    expect(s.upcoming.map((t) => t.id)).toEqual(['a', 'b']);
  });
});
