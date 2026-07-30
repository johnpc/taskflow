import { describe, it, expect } from 'vitest';
import { filterAssignedToMe } from './assignedFilter';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord => ({ id: 't', ...over }) as TaskRecord;
const tasks = [
  task({ id: 'a', assigneeEmail: 'me@x.co' }),
  task({ id: 'b', assigneeEmail: 'other@x.co' }),
  task({ id: 'c', assigneeEmail: null }),
];

describe('filterAssignedToMe', () => {
  it('keeps only my tasks when on', () => {
    expect(filterAssignedToMe(tasks, 'me@x.co', true).map((t) => t.id)).toEqual(['a']);
  });

  it('returns everything when off', () => {
    expect(filterAssignedToMe(tasks, 'me@x.co', false)).toHaveLength(3);
  });

  it('returns everything when there is no signed-in email', () => {
    expect(filterAssignedToMe(tasks, null, true)).toHaveLength(3);
  });
});
