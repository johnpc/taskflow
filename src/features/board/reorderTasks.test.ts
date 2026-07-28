import { describe, it, expect } from 'vitest';
import { reorderTasks } from './reorderTasks';
import type { TaskRecord } from '../../lib/dataClient';

const t = (id: string, sortOrder: number): TaskRecord => ({ id, sortOrder }) as TaskRecord;
const col = [t('a', 0), t('b', 1), t('c', 2)];

describe('reorderTasks', () => {
  it('swaps sortOrder with the previous task on up', () => {
    expect(reorderTasks(col, 'b', 'up')).toEqual([
      { id: 'b', sortOrder: 0 },
      { id: 'a', sortOrder: 1 },
    ]);
  });

  it('swaps sortOrder with the next task on down', () => {
    expect(reorderTasks(col, 'b', 'down')).toEqual([
      { id: 'b', sortOrder: 2 },
      { id: 'c', sortOrder: 1 },
    ]);
  });

  it('is a no-op moving the first task up', () => {
    expect(reorderTasks(col, 'a', 'up')).toEqual([]);
  });

  it('is a no-op moving the last task down', () => {
    expect(reorderTasks(col, 'c', 'down')).toEqual([]);
  });

  it('is a no-op for an unknown task', () => {
    expect(reorderTasks(col, 'zzz', 'up')).toEqual([]);
  });
});
