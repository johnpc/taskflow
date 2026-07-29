import { describe, it, expect } from 'vitest';
import { completeWarning } from './completeWarning';
import type { TaskRecord } from '../../lib/dataClient';

const sub = (status: string): TaskRecord => ({ status }) as TaskRecord;

describe('completeWarning', () => {
  it('is null when unblocked with no open subtasks', () => {
    expect(completeWarning(false, [sub('DONE')])).toBeNull();
    expect(completeWarning(false, [])).toBeNull();
  });

  it('warns about dependencies first when blocked', () => {
    expect(completeWarning(true, [sub('TODO')])).toContain('unfinished dependencies');
  });

  it('warns about incomplete subtasks, pluralizing correctly', () => {
    expect(completeWarning(false, [sub('TODO')])).toBe(
      'It still has 1 incomplete subtask. Complete it anyway?',
    );
    expect(completeWarning(false, [sub('TODO'), sub('DONE'), sub('TODO')])).toBe(
      'It still has 2 incomplete subtasks. Complete it anyway?',
    );
  });
});
