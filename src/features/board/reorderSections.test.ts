import { describe, it, expect } from 'vitest';
import { reorderSections } from './reorderSections';
import type { SectionRecord } from '../../lib/dataClient';

const s = (id: string, sortOrder: number): SectionRecord => ({ id, sortOrder }) as SectionRecord;
const cols = [s('a', 0), s('b', 1), s('c', 2)];

describe('reorderSections', () => {
  it('swaps with the previous section on left', () => {
    expect(reorderSections(cols, 'b', 'left')).toEqual([
      { id: 'b', sortOrder: 0 },
      { id: 'a', sortOrder: 1 },
    ]);
  });

  it('swaps with the next section on right', () => {
    expect(reorderSections(cols, 'b', 'right')).toEqual([
      { id: 'b', sortOrder: 2 },
      { id: 'c', sortOrder: 1 },
    ]);
  });

  it('is a no-op at the edges and for unknown ids', () => {
    expect(reorderSections(cols, 'a', 'left')).toEqual([]);
    expect(reorderSections(cols, 'c', 'right')).toEqual([]);
    expect(reorderSections(cols, 'zzz', 'left')).toEqual([]);
  });
});
