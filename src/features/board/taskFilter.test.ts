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

  it('filters by priority', () => {
    const out = applyFilter(
      [task({ id: 'a', priority: 'HIGH' }), task({ id: 'b', priority: 'LOW' })],
      { ...DEFAULT_FILTER, priority: 'HIGH' },
    );
    expect(out.map((t) => t.id)).toEqual(['a']);
  });

  it('filters by due window against the injected today', () => {
    const tasks = [
      task({ id: 'over', dueDate: '2026-01-01' }),
      task({ id: 'today', dueDate: '2026-02-02' }),
      task({ id: 'soon', dueDate: '2026-03-03' }),
      task({ id: 'none', dueDate: null }),
    ];
    const overdue = applyFilter(tasks, { ...DEFAULT_FILTER, dueWindow: 'overdue' }, '2026-02-02');
    expect(overdue.map((t) => t.id)).toEqual(['over']);
    const today = applyFilter(tasks, { ...DEFAULT_FILTER, dueWindow: 'today' }, '2026-02-02');
    expect(today.map((t) => t.id)).toEqual(['today']);
  });

  it('filters by assignee, including an unassigned bucket', () => {
    const tasks = [
      task({ id: 'mine', assigneeEmail: 'me@x.co' }),
      task({ id: 'theirs', assigneeEmail: 'you@x.co' }),
      task({ id: 'none', assigneeEmail: null }),
    ];
    expect(applyFilter(tasks, { ...DEFAULT_FILTER, assignee: 'me@x.co' }).map((t) => t.id)).toEqual(
      ['mine'],
    );
    expect(applyFilter(tasks, { ...DEFAULT_FILTER, assignee: '_none' }).map((t) => t.id)).toEqual([
      'none',
    ]);
  });
});
