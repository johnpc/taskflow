import { describe, it, expect } from 'vitest';
import { timelineLayout } from './timelineLayout';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', startDate: null, dueDate: null, ...over }) as TaskRecord;

const START = '2026-03-01';

describe('timelineLayout', () => {
  it('places a start→due bar at the right offset and span', () => {
    const [bar] = timelineLayout(
      [task({ startDate: '2026-03-03', dueDate: '2026-03-05' })],
      START,
      14,
    );
    expect(bar.offset).toBe(2); // Mar 3 is 2 days after Mar 1
    expect(bar.span).toBe(3); // 3rd..5th inclusive
  });

  it('uses due date as start when no start date (span 1)', () => {
    const [bar] = timelineLayout([task({ dueDate: '2026-03-04' })], START, 14);
    expect(bar).toMatchObject({ offset: 3, span: 1 });
  });

  it('drops tasks with no due date, done tasks, subtasks, and out-of-window bars', () => {
    const out = timelineLayout(
      [
        task({ id: 'nodue' }),
        task({ id: 'done', dueDate: '2026-03-04', status: 'DONE' }),
        task({ id: 'sub', dueDate: '2026-03-04', parentTaskId: 'p' }),
        task({ id: 'far', dueDate: '2026-04-30' }),
      ],
      START,
      14,
    );
    expect(out).toEqual([]);
  });

  it('clamps a bar that starts before the window', () => {
    const [bar] = timelineLayout(
      [task({ startDate: '2026-02-25', dueDate: '2026-03-03' })],
      START,
      14,
    );
    expect(bar).toMatchObject({ offset: 0, span: 3 }); // Mar 1..3 inclusive (clamped start)
  });
});
