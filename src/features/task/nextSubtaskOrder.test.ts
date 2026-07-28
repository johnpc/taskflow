import { describe, it, expect } from 'vitest';
import { nextSubtaskOrder } from './nextSubtaskOrder';
import type { TaskRecord } from '../../lib/dataClient';

const t = (sortOrder: number): TaskRecord => ({ id: 'x', sortOrder }) as TaskRecord;

describe('nextSubtaskOrder', () => {
  it('is 0 for no subtasks', () => {
    expect(nextSubtaskOrder([])).toBe(0);
  });
  it('is one past the highest order', () => {
    expect(nextSubtaskOrder([t(0), t(3), t(1)])).toBe(4);
  });
});
