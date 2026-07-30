import { describe, it, expect } from 'vitest';
import { customFieldChips } from './customFieldChips';
import type { CustomFieldRecord, TaskRecord } from '../../lib/dataClient';

const fields = [
  { id: 'a', name: 'Size', fieldType: 'TEXT' } as CustomFieldRecord,
  { id: 'b', name: 'Stage', fieldType: 'SELECT' } as CustomFieldRecord,
];
const task = (values: Record<string, string>): Pick<TaskRecord, 'customValues'> =>
  ({ customValues: JSON.stringify(values) }) as Pick<TaskRecord, 'customValues'>;

describe('customFieldChips', () => {
  it('shows only fields with a value, in field order', () => {
    expect(customFieldChips(task({ b: 'Doing', a: 'L' }), fields)).toEqual([
      { id: 'a', name: 'Size', value: 'L' },
      { id: 'b', name: 'Stage', value: 'Doing' },
    ]);
  });

  it('is empty when the task has no values', () => {
    expect(customFieldChips(task({}), fields)).toEqual([]);
  });
});
