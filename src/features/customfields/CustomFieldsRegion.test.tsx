import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useCustomFields } = vi.hoisted(() => ({ useCustomFields: vi.fn() }));
vi.mock('./useCustomFields', () => ({ useCustomFields }));

import { CustomFieldsRegion } from './CustomFieldsRegion';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    projectId: 'p',
    customValues: JSON.stringify({ f1: 'Large' }),
    ...over,
  }) as TaskRecord;

beforeEach(() =>
  useCustomFields.mockReturnValue({
    fields: [{ id: 'f1', name: 'Size', fieldType: 'TEXT' }],
    add: { mutate: vi.fn(), isPending: false },
  }),
);

describe('CustomFieldsRegion', () => {
  it('patches customValues when a field value changes', () => {
    const onPatch = vi.fn();
    render(<CustomFieldsRegion task={task({})} onPatch={onPatch} />);
    const input = screen.getByTestId('custom-field-input-f1');
    fireEvent.change(input, { target: { value: 'Small' } });
    fireEvent.blur(input);
    expect(onPatch).toHaveBeenCalledWith(JSON.stringify({ f1: 'Small' }));
  });

  it('clears a field from the map when blanked', () => {
    const onPatch = vi.fn();
    render(<CustomFieldsRegion task={task({})} onPatch={onPatch} />);
    const input = screen.getByTestId('custom-field-input-f1');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(onPatch).toHaveBeenCalledWith(JSON.stringify({}));
  });
});
