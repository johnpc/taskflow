import { describe, it, expect } from 'vitest';
import { computeReorderDrop } from './computeReorderDrop';
import type { Column } from './taskGrouping';
import type { TaskRecord } from '../../lib/dataClient';

const t = (id: string, sectionId: string, sortOrder: number): TaskRecord =>
  ({ id, sectionId, sortOrder, title: id, status: 'TODO' }) as TaskRecord;

const col = (id: string, tasks: TaskRecord[]): Column =>
  ({ section: { id, name: id, sortOrder: 0 }, tasks }) as unknown as Column;

describe('computeReorderDrop', () => {
  it('reorders within a section by inserting before the target', () => {
    const cols = [col('s1', [t('a', 's1', 0), t('b', 's1', 1), t('c', 's1', 2)])];
    // Drop c onto a → order becomes c, a, b.
    const patches = computeReorderDrop(cols, 'c', 'a');
    expect(patches).toEqual([
      { id: 'c', sectionId: 's1', sortOrder: 0 },
      { id: 'a', sectionId: 's1', sortOrder: 1 },
      { id: 'b', sectionId: 's1', sortOrder: 2 },
    ]);
  });

  it('moves across sections, resequencing both', () => {
    const cols = [col('s1', [t('a', 's1', 0), t('b', 's1', 1)]), col('s2', [t('x', 's2', 0)])];
    // Drop b onto x → b goes to s2 at index 0; s1 compacts.
    const patches = computeReorderDrop(cols, 'b', 'x');
    expect(patches).toContainEqual({ id: 'b', sectionId: 's2', sortOrder: 0 });
    expect(patches).toContainEqual({ id: 'x', sectionId: 's2', sortOrder: 1 });
    // a was already s1/0 — unchanged, so no patch for it.
    expect(patches.find((p) => p.id === 'a')).toBeUndefined();
  });

  it('is a no-op dropping a task on itself or an unknown target', () => {
    const cols = [col('s1', [t('a', 's1', 0), t('b', 's1', 1)])];
    expect(computeReorderDrop(cols, 'a', 'a')).toEqual([]);
    expect(computeReorderDrop(cols, 'a', 'gone')).toEqual([]);
  });
});
