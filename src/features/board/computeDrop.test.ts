import { describe, it, expect } from 'vitest';
import { computeDrop } from './computeDrop';
import type { Column } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const col = (id: string, tasks: TaskRecord[]): Column => ({
  section: { id, name: id } as SectionRecord,
  tasks,
});
const t = (id: string, sortOrder: number): TaskRecord => ({ id, sortOrder }) as TaskRecord;

const columns = [col('s1', [t('a', 0), t('b', 1)]), col('s2', [t('c', 0)])];

describe('computeDrop', () => {
  it('moves a task to the target section, appended', () => {
    expect(computeDrop(columns, 'a', 's2')).toEqual({ id: 'a', sectionId: 's2', sortOrder: 1 });
  });

  it('appends at 0 into an empty section', () => {
    const cols = [col('s1', [t('a', 0)]), col('s2', [])];
    expect(computeDrop(cols, 'a', 's2')).toEqual({ id: 'a', sectionId: 's2', sortOrder: 0 });
  });

  it('is a no-op when dropped on its own section', () => {
    expect(computeDrop(columns, 'a', 's1')).toBeNull();
  });

  it('is a no-op for an unknown task or target', () => {
    expect(computeDrop(columns, 'zzz', 's2')).toBeNull();
    expect(computeDrop(columns, 'a', 'gone')).toBeNull();
  });
});
