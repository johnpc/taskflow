import { describe, it, expect } from 'vitest';
import { sortListRows, toggleListSort, DEFAULT_LIST_SORT } from './listSort';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

const rows = [
  task({
    id: 'b',
    title: 'Banana',
    priority: 'LOW',
    dueDate: '2030-05-01',
    assigneeEmail: 'z@x.co',
  }),
  task({ id: 'a', title: 'Apple', priority: 'HIGH', dueDate: null, assigneeEmail: 'a@x.co' }),
  task({ id: 'c', title: 'Cherry', priority: 'MEDIUM', dueDate: '2030-01-01' }),
];

describe('sortListRows', () => {
  it('manual keeps the input order', () => {
    expect(sortListRows(rows, DEFAULT_LIST_SORT).map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by title ascending and descending', () => {
    expect(sortListRows(rows, { key: 'title', dir: 'asc' }).map((t) => t.id)).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(sortListRows(rows, { key: 'title', dir: 'desc' }).map((t) => t.id)).toEqual([
      'c',
      'b',
      'a',
    ]);
  });

  it('sorts by priority (High first) then due (nulls last)', () => {
    expect(sortListRows(rows, { key: 'priority', dir: 'asc' }).map((t) => t.id)).toEqual([
      'a',
      'c',
      'b',
    ]);
    expect(sortListRows(rows, { key: 'due', dir: 'asc' }).map((t) => t.id)).toEqual([
      'c',
      'b',
      'a',
    ]);
  });

  it('sorts by assignee with unassigned last', () => {
    // a@x.co < z@x.co < (unassigned → sorts last)
    expect(sortListRows(rows, { key: 'assignee', dir: 'asc' }).map((t) => t.id)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});

describe('toggleListSort', () => {
  it('activates a new column ascending', () => {
    expect(toggleListSort(DEFAULT_LIST_SORT, 'due')).toEqual({ key: 'due', dir: 'asc' });
  });

  it('flips direction on the active column', () => {
    expect(toggleListSort({ key: 'due', dir: 'asc' }, 'due')).toEqual({ key: 'due', dir: 'desc' });
    expect(toggleListSort({ key: 'due', dir: 'desc' }, 'due')).toEqual({ key: 'due', dir: 'asc' });
  });
});
