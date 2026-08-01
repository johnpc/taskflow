import { describe, it, expect } from 'vitest';
import { buildMyTasksBuckets } from './myTasksView';
import { DEFAULT_LIST_SORT } from '../board/listSort';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: '', status: 'TODO', priority: 'NONE', ...over }) as TaskRecord;

const base = {
  mode: 'priority' as const,
  today: '2026-08-15',
  showCompleted: false,
  sort: DEFAULT_LIST_SORT,
};

describe('buildMyTasksBuckets', () => {
  it('groups by the mode and keeps grouping order under manual sort', () => {
    const tasks = [task({ id: 'a', priority: 'LOW' }), task({ id: 'b', priority: 'HIGH' })];
    const buckets = buildMyTasksBuckets({ ...base, tasks });
    expect(buckets.map((b) => b.key)).toEqual(['HIGH', 'LOW']); // priority order
  });

  it('sorts within each bucket by the chosen column', () => {
    const tasks = [
      task({ id: 'a', priority: 'HIGH', title: 'Zebra' }),
      task({ id: 'b', priority: 'HIGH', title: 'Apple' }),
    ];
    const buckets = buildMyTasksBuckets({ ...base, tasks, sort: { key: 'title', dir: 'asc' } });
    expect(buckets[0].tasks.map((t) => t.id)).toEqual(['b', 'a']); // Apple before Zebra
  });

  it('reverses within a bucket on descending', () => {
    const tasks = [
      task({ id: 'a', priority: 'HIGH', title: 'Apple' }),
      task({ id: 'b', priority: 'HIGH', title: 'Zebra' }),
    ];
    const buckets = buildMyTasksBuckets({ ...base, tasks, sort: { key: 'title', dir: 'desc' } });
    expect(buckets[0].tasks.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('appends a Completed bucket when showCompleted is on', () => {
    const tasks = [task({ id: 'a', priority: 'HIGH' }), task({ id: 'd', status: 'DONE' })];
    const buckets = buildMyTasksBuckets({ ...base, tasks, showCompleted: true });
    expect(buckets.some((b) => b.key === 'completed')).toBe(true);
  });
});
