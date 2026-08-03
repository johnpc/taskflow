import { describe, it, expect } from 'vitest';
import { groupByDay, dayLabel } from './groupByDay';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', dueDate: null, ...over }) as TaskRecord;

const today = '2026-07-30';
const tomorrow = '2026-07-31';
const horizon = ['2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02'];

describe('dayLabel', () => {
  it('labels today and tomorrow', () => {
    expect(dayLabel('2026-07-30', today, tomorrow)).toBe('Today');
    expect(dayLabel('2026-07-31', today, tomorrow)).toBe('Tomorrow');
  });
  it('labels other days with weekday + month', () => {
    expect(dayLabel('2026-08-01', today, tomorrow)).toBe('Sat, Aug 1');
  });
});

describe('groupByDay', () => {
  it('buckets open dated tasks within the horizon by day, chronological', () => {
    const out = groupByDay(
      [task({ id: 'b', dueDate: '2026-08-01' }), task({ id: 'a', dueDate: '2026-07-30' })],
      today,
      tomorrow,
      horizon,
    );
    expect(out.map((d) => d.date)).toEqual(['2026-07-30', '2026-08-01']);
  });

  it('flags only the today group as isToday', () => {
    const out = groupByDay(
      [task({ id: 'a', dueDate: '2026-07-30' }), task({ id: 'b', dueDate: '2026-08-01' })],
      today,
      tomorrow,
      horizon,
    );
    expect(out.map((d) => d.isToday)).toEqual([true, false]);
  });

  it('excludes done, undated, out-of-window, and overdue tasks', () => {
    const out = groupByDay(
      [
        task({ id: 'done', status: 'DONE', dueDate: '2026-07-30' }),
        task({ id: 'undated', dueDate: null }),
        task({ id: 'far', dueDate: '2026-09-01' }),
        task({ id: 'overdue', dueDate: '2026-07-01' }),
      ],
      today,
      tomorrow,
      horizon,
    );
    expect(out).toEqual([]);
  });

  it('sorts tasks within a day by title', () => {
    const out = groupByDay(
      [
        task({ id: 'z', title: 'Zed', dueDate: today }),
        task({ id: 'a', title: 'Ann', dueDate: today }),
      ],
      today,
      tomorrow,
      horizon,
    );
    expect(out[0].tasks.map((t) => t.title)).toEqual(['Ann', 'Zed']);
  });
});
