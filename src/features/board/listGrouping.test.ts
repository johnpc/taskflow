import { describe, it, expect } from 'vitest';
import { groupListBy } from './listGrouping';
import type { Column } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

const columns: Column[] = [
  {
    section: { id: 's1', name: 'To do' } as SectionRecord,
    tasks: [
      task({ id: 'a', priority: 'HIGH', assigneeEmail: 'me@x.co', dueDate: '2020-01-01' }),
      task({ id: 'b', priority: 'NONE' }),
    ],
  },
  {
    section: { id: 's2', name: 'Doing' } as SectionRecord,
    tasks: [task({ id: 'c', priority: 'HIGH', assigneeEmail: 'me@x.co' })],
  },
];

describe('groupListBy', () => {
  it('SECTION returns the columns as groups', () => {
    const groups = groupListBy(columns, 'SECTION', '2025-01-01');
    expect(groups.map((g) => g.name)).toEqual(['To do', 'Doing']);
    expect(groups[0].tasks.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('PRIORITY buckets across sections, high first, empties dropped', () => {
    const groups = groupListBy(columns, 'PRIORITY', '2025-01-01');
    expect(groups.map((g) => g.name)).toEqual(['High priority', 'No priority']);
    expect(groups[0].tasks.map((t) => t.id)).toEqual(['a', 'c']);
  });

  it('ASSIGNEE buckets by email with an Unassigned group', () => {
    const groups = groupListBy(columns, 'ASSIGNEE', '2025-01-01');
    const byName = Object.fromEntries(groups.map((g) => [g.name, g.tasks.map((t) => t.id)]));
    expect(byName['Unassigned']).toEqual(['b']);
    expect(byName['me@x.co']).toEqual(['a', 'c']);
  });

  it('DUE buckets relative to today (overdue vs no date)', () => {
    const groups = groupListBy(columns, 'DUE', '2025-01-01');
    const names = groups.map((g) => g.name);
    expect(names).toContain('Overdue');
    expect(names).toContain('No due date');
    expect(groups.find((g) => g.name === 'Overdue')!.tasks.map((t) => t.id)).toEqual(['a']);
  });
});
