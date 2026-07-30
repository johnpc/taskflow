import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useCustomFields } = vi.hoisted(() => ({ useCustomFields: vi.fn() }));
vi.mock('./useCustomFields', () => ({ useCustomFields }));

import { ProjectFieldsRegion } from './ProjectFieldsRegion';

const add = { mutate: vi.fn(), isPending: false };
beforeEach(() => {
  add.mutate.mockClear();
  useCustomFields.mockReturnValue({
    fields: [{ id: 'f1', name: 'Size', fieldType: 'SELECT' }],
    add,
  });
});

describe('ProjectFieldsRegion', () => {
  it('is collapsed until toggled, then lists fields with their type', () => {
    render(<ProjectFieldsRegion projectId="p" />);
    expect(screen.queryByTestId('project-field')).toBeNull();
    fireEvent.click(screen.getByTestId('project-fields-toggle'));
    const field = screen.getByTestId('project-field');
    expect(field).toHaveTextContent('Size');
    expect(field).toHaveTextContent('Select');
  });

  it('shows an empty hint when the project has no fields', () => {
    useCustomFields.mockReturnValue({ fields: [], add });
    render(<ProjectFieldsRegion projectId="p" />);
    fireEvent.click(screen.getByTestId('project-fields-toggle'));
    expect(screen.getByText(/No custom fields yet/i)).toBeInTheDocument();
  });

  it('adds a field from the composer', () => {
    render(<ProjectFieldsRegion projectId="p" />);
    fireEvent.click(screen.getByTestId('project-fields-toggle'));
    fireEvent.change(screen.getByTestId('custom-field-name'), { target: { value: 'Effort' } });
    fireEvent.click(screen.getByTestId('custom-field-add'));
    expect(add.mutate).toHaveBeenCalledWith({
      name: 'Effort',
      fieldType: 'TEXT',
      options: undefined,
    });
  });
});
