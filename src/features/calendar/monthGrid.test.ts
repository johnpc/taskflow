import { describe, it, expect } from 'vitest';
import { monthMatrix, monthLabel } from './monthGrid';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 'x', title: 'T', ...over }) as TaskRecord;

describe('monthLabel', () => {
  it('names the 1-based month with the year', () => {
    expect(monthLabel(2026, 8)).toBe('August 2026');
    expect(monthLabel(2026, 1)).toBe('January 2026');
  });
});

describe('monthMatrix', () => {
  // August 2026: Aug 1 is a Saturday → first week is Sun Jul26..Sat Aug1.
  it('builds Sunday-first rectangular weeks with spill-over days', () => {
    const weeks = monthMatrix(2026, 8, '2026-08-15', []);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0][0].date).toBe('2026-07-26'); // leading spill-over Sunday
    expect(weeks[0][0].inMonth).toBe(false);
    expect(weeks[0][6].date).toBe('2026-08-01'); // first Saturday is Aug 1
    expect(weeks[0][6].inMonth).toBe(true);
  });

  it('places a task on its due-date cell and flags today', () => {
    const weeks = monthMatrix(2026, 8, '2026-08-15', [task({ id: 'a', dueDate: '2026-08-15' })]);
    const cell = weeks.flat().find((c) => c.date === '2026-08-15')!;
    expect(cell.isToday).toBe(true);
    expect(cell.tasks.map((t) => t.id)).toEqual(['a']);
  });

  it('excludes done + undated + out-of-window tasks', () => {
    const weeks = monthMatrix(2026, 8, '2026-08-15', [
      task({ id: 'done', dueDate: '2026-08-10', status: 'DONE' }),
      task({ id: 'undated' }),
      task({ id: 'other', dueDate: '2026-12-25' }),
    ]);
    expect(weeks.flat().every((c) => c.tasks.length === 0)).toBe(true);
  });

  it('sorts a day’s tasks by title', () => {
    const weeks = monthMatrix(2026, 8, '2026-08-01', [
      task({ id: 'b', title: 'Beta', dueDate: '2026-08-05' }),
      task({ id: 'a', title: 'Alpha', dueDate: '2026-08-05' }),
    ]);
    const cell = weeks.flat().find((c) => c.date === '2026-08-05')!;
    expect(cell.tasks.map((t) => t.title)).toEqual(['Alpha', 'Beta']);
  });
});
