import { describe, it, expect } from 'vitest';
import { matchTasks, filterResults, DEFAULT_SEARCH_FILTERS } from './matchTasks';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: '', notes: null, status: 'TODO', priority: 'NONE', ...over }) as TaskRecord;

describe('matchTasks', () => {
  const tasks = [
    task({ id: 'a', title: 'Ship the release notes' }),
    task({ id: 'b', title: 'Design review', notes: 'discuss the RELEASE plan' }),
    task({ id: 'c', title: 'Standup', assigneeEmail: 'sam@example.com' }),
  ];

  it('returns nothing for a blank query', () => {
    expect(matchTasks(tasks, '')).toEqual([]);
    expect(matchTasks(tasks, '   ')).toEqual([]);
  });

  it('matches title case-insensitively', () => {
    expect(matchTasks(tasks, 'ship').map((t) => t.id)).toEqual(['a']);
  });

  it('matches notes too', () => {
    expect(
      matchTasks(tasks, 'release')
        .map((t) => t.id)
        .sort(),
    ).toEqual(['a', 'b']);
  });

  it('matches the assignee email', () => {
    expect(matchTasks(tasks, 'sam@example').map((t) => t.id)).toEqual(['c']);
  });

  it('returns empty when nothing matches', () => {
    expect(matchTasks(tasks, 'zzz')).toEqual([]);
  });

  it('matches a task by its label name when a label map is given', () => {
    const labelled = [
      task({ id: 'x', title: 'Fix login', labelIds: ['l1'] }),
      task({ id: 'y', title: 'Write copy', labelIds: ['l2'] }),
    ];
    const names = new Map([
      ['l1', 'Backend'],
      ['l2', 'Marketing'],
    ]);
    expect(matchTasks(labelled, 'backend', names).map((t) => t.id)).toEqual(['x']);
    // Without the map, the label name is not searchable.
    expect(matchTasks(labelled, 'backend')).toEqual([]);
  });
});

describe('filterResults', () => {
  const D = DEFAULT_SEARCH_FILTERS;
  const tasks = [
    task({ id: 'h', priority: 'HIGH', projectId: 'p1' }),
    task({ id: 'l', priority: 'LOW', projectId: 'p2' }),
    task({ id: 'done', priority: 'HIGH', status: 'DONE', projectId: 'p1' }),
  ];

  it('passes everything through with default filters', () => {
    expect(filterResults(tasks, D)).toHaveLength(3);
  });

  it('filters by priority', () => {
    expect(filterResults(tasks, { ...D, priority: 'HIGH' }).map((t) => t.id)).toEqual([
      'h',
      'done',
    ]);
  });

  it('hides completed', () => {
    expect(filterResults(tasks, { ...D, hideDone: true }).map((t) => t.id)).toEqual(['h', 'l']);
  });

  it('filters by project', () => {
    expect(filterResults(tasks, { ...D, projectId: 'p2' }).map((t) => t.id)).toEqual(['l']);
  });

  it('combines priority, project, and hide-completed', () => {
    expect(
      filterResults(tasks, { priority: 'HIGH', projectId: 'p1', hideDone: true }).map((t) => t.id),
    ).toEqual(['h']);
  });
});
