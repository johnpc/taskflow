import { describe, it, expect } from 'vitest';
import { matchTasks } from './matchTasks';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: '', notes: null, ...over }) as TaskRecord;

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
