import { describe, it, expect } from 'vitest';
import { applyFilter, DEFAULT_FILTER } from './taskFilter';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'T',
    status: 'TODO',
    priority: 'NONE',
    dueDate: null,
    sortOrder: 0,
    labelIds: [],
    ...over,
  }) as TaskRecord;

describe('applyFilter', () => {
  it('hides done tasks by default', () => {
    const out = applyFilter([task({ id: 'a' }), task({ id: 'b', status: 'DONE' })], DEFAULT_FILTER);
    expect(out.map((t) => t.id)).toEqual(['a']);
  });

  it('shows done tasks when hideDone is off', () => {
    const out = applyFilter([task({ id: 'a' }), task({ id: 'b', status: 'DONE' })], {
      ...DEFAULT_FILTER,
      hideDone: false,
    });
    expect(out.map((t) => t.id).sort()).toEqual(['a', 'b']);
  });

  it('filters by label id', () => {
    const out = applyFilter(
      [task({ id: 'a', labelIds: ['x'] }), task({ id: 'b', labelIds: ['y'] })],
      { ...DEFAULT_FILTER, labelId: 'x' },
    );
    expect(out.map((t) => t.id)).toEqual(['a']);
  });

  it('sorts by due date', () => {
    const out = applyFilter(
      [
        task({ id: 'a', dueDate: '2026-09-01' }),
        task({ id: 'b', dueDate: '2026-08-01' }),
        task({ id: 'c', dueDate: null }),
      ],
      { ...DEFAULT_FILTER, sort: 'due' },
    );
    expect(out.map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by priority (high first)', () => {
    const out = applyFilter(
      [
        task({ id: 'a', priority: 'LOW' }),
        task({ id: 'b', priority: 'HIGH' }),
        task({ id: 'c', priority: 'MEDIUM' }),
      ],
      { ...DEFAULT_FILTER, sort: 'priority' },
    );
    expect(out.map((t) => t.id)).toEqual(['b', 'c', 'a']);
  });

  it('manual sort keeps the incoming order', () => {
    const out = applyFilter(
      [task({ id: 'a', sortOrder: 5 }), task({ id: 'b', sortOrder: 1 })],
      DEFAULT_FILTER,
    );
    expect(out.map((t) => t.id)).toEqual(['a', 'b']);
  });
});
