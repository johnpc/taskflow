import { describe, it, expect } from 'vitest';
import { groupByLabel } from './groupByLabel';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', dueDate: null, labelIds: [], ...over }) as TaskRecord;

const labels = [
  { id: 'l1', name: 'Bug' },
  { id: 'l2', name: 'Feature' },
] as LabelRecord[];

describe('groupByLabel', () => {
  it('buckets a task under every label it carries, with a No-label group', () => {
    const groups = groupByLabel(
      [
        task({ id: 'both', labelIds: ['l1', 'l2'] }),
        task({ id: 'bug', labelIds: ['l1'] }),
        task({ id: 'none', labelIds: [] }),
      ],
      labels,
    );
    const byLabel = Object.fromEntries(groups.map((g) => [g.label, g.tasks.map((t) => t.id)]));
    expect(byLabel['Bug']).toEqual(['both', 'bug']);
    expect(byLabel['Feature']).toEqual(['both']);
    expect(byLabel['No label']).toEqual(['none']);
  });

  it('drops empty buckets and excludes done tasks', () => {
    const groups = groupByLabel(
      [task({ id: 'd', labelIds: ['l1'], status: 'DONE' }), task({ id: 'o', labelIds: [] })],
      labels,
    );
    // Bug bucket is empty (only a done task), Feature empty → dropped; No label has the open one.
    expect(groups.map((g) => g.label)).toEqual(['No label']);
  });

  it('sorts within a bucket by due date then title', () => {
    const groups = groupByLabel(
      [
        task({ id: 'late', labelIds: ['l1'], dueDate: '2026-09-01', title: 'B' }),
        task({ id: 'soon', labelIds: ['l1'], dueDate: '2026-08-01', title: 'A' }),
      ],
      labels,
    );
    expect(groups[0].tasks.map((t) => t.id)).toEqual(['soon', 'late']);
  });
});
