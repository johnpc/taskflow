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
});
