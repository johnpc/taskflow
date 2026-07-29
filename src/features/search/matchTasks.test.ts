import { describe, it, expect } from 'vitest';
import { matchTasks, filterResults } from './matchTasks';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: '', notes: null, status: 'TODO', priority: 'NONE', ...over }) as TaskRecord;

describe('matchTasks', () => {
  const tasks = [
    task({ id: 'a', title: 'Ship the release notes' }),
    task({ id: 'b', title: 'Design review', notes: 'discuss the RELEASE plan' }),
    task({ id: 'c', title: 'Standup' }),
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

  it('returns empty when nothing matches', () => {
    expect(matchTasks(tasks, 'zzz')).toEqual([]);
  });
});

describe('filterResults', () => {
  const tasks = [
    task({ id: 'h', priority: 'HIGH' }),
    task({ id: 'l', priority: 'LOW' }),
    task({ id: 'done', priority: 'HIGH', status: 'DONE' }),
  ];

  it('passes everything through with default filters', () => {
    expect(filterResults(tasks, { priority: '', hideDone: false })).toHaveLength(3);
  });

  it('filters by priority', () => {
    expect(filterResults(tasks, { priority: 'HIGH', hideDone: false }).map((t) => t.id)).toEqual([
      'h',
      'done',
    ]);
  });

  it('hides completed', () => {
    expect(filterResults(tasks, { priority: '', hideDone: true }).map((t) => t.id)).toEqual([
      'h',
      'l',
    ]);
  });

  it('combines priority and hide-completed', () => {
    expect(filterResults(tasks, { priority: 'HIGH', hideDone: true }).map((t) => t.id)).toEqual([
      'h',
    ]);
  });
});
