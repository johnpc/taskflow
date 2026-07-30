import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { useCustomFields } = vi.hoisted(() => ({ useCustomFields: vi.fn() }));
vi.mock('./useCustomFields', () => ({ useCustomFields }));

import { CardCustomFieldChips } from './CardCustomFieldChips';
import type { TaskRecord } from '../../lib/dataClient';

const task = (values: Record<string, string>): TaskRecord =>
  ({ id: 't', projectId: 'p', customValues: JSON.stringify(values) }) as TaskRecord;

beforeEach(() =>
  useCustomFields.mockReturnValue({
    fields: [{ id: 'f1', name: 'Size', fieldType: 'TEXT' }],
    add: { mutate: vi.fn() },
  }),
);

describe('CardCustomFieldChips', () => {
  it('renders a chip for each set field', () => {
    render(<CardCustomFieldChips task={task({ f1: 'Large' })} />);
    expect(screen.getByTestId('task-cf-chip')).toHaveTextContent('Size: Large');
  });

  it('renders nothing when no field has a value', () => {
    const { container } = render(<CardCustomFieldChips task={task({})} />);
    expect(container).toBeEmptyDOMElement();
  });
});
