import { describe, it, expect } from 'vitest';
import { selectBuckets } from './selectBuckets';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'T',
    status: 'TODO',
    priority: 'HIGH',
    myBucket: 'TODAY',
    dueDate: null,
    ...over,
  }) as TaskRecord;

const today = '2026-07-28';

describe('selectBuckets', () => {
  const data = [task({})];
  it('groups by due date by default', () => {
    expect(selectBuckets('due', data, today)[0].key).toBe('noDate');
  });
  it('groups by priority', () => {
    expect(selectBuckets('priority', data, today)[0].key).toBe('HIGH');
  });
  it('groups by focus', () => {
    expect(selectBuckets('focus', data, today)[0].key).toBe('TODAY');
  });
  it('groups by project via the name resolver', () => {
    const tasks = [task({ projectId: 'p1' })];
    expect(selectBuckets('project', tasks, today, () => 'Alpha')[0].label).toBe('Alpha');
  });
  it('groups by label via the registry', () => {
    const tasks = [task({ labelIds: ['l1'] })];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labels = [{ id: 'l1', name: 'Bug' }] as any;
    expect(selectBuckets('label', tasks, today, undefined, labels)[0].label).toBe('Bug');
  });
});
