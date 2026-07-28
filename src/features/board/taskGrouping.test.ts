import { describe, it, expect } from 'vitest';
import { groupTasksBySection } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const section = (id: string, sortOrder: number): SectionRecord =>
  ({ id, name: id, sortOrder }) as SectionRecord;
const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', sortOrder: 0, parentTaskId: null, ...over }) as TaskRecord;

describe('groupTasksBySection', () => {
  const s1 = section('s1', 0);
  const s2 = section('s2', 1);

  it('places tasks under their section', () => {
    const cols = groupTasksBySection(
      [s1, s2],
      [task({ id: 'a', sectionId: 's2' }), task({ id: 'b', sectionId: 's1' })],
    );
    expect(cols.find((c) => c.section.id === 's1')!.tasks.map((t) => t.id)).toEqual(['b']);
    expect(cols.find((c) => c.section.id === 's2')!.tasks.map((t) => t.id)).toEqual(['a']);
  });

  it('orders tasks within a column by sortOrder', () => {
    const cols = groupTasksBySection(
      [s1],
      [
        task({ id: 'a', sectionId: 's1', sortOrder: 2 }),
        task({ id: 'b', sectionId: 's1', sortOrder: 1 }),
      ],
    );
    expect(cols[0].tasks.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('excludes subtasks (tasks with a parent)', () => {
    const cols = groupTasksBySection(
      [s1],
      [task({ id: 'a', sectionId: 's1' }), task({ id: 'sub', sectionId: 's1', parentTaskId: 'a' })],
    );
    expect(cols[0].tasks.map((t) => t.id)).toEqual(['a']);
  });

  it('drops orphan-section tasks onto the first column', () => {
    const cols = groupTasksBySection([s1, s2], [task({ id: 'a', sectionId: 'gone' })]);
    expect(cols[0].tasks.map((t) => t.id)).toEqual(['a']);
  });

  it('returns a column per section even when empty', () => {
    const cols = groupTasksBySection([s1, s2], []);
    expect(cols.map((c) => c.section.id)).toEqual(['s1', 's2']);
    expect(cols.every((c) => c.tasks.length === 0)).toBe(true);
  });
});
