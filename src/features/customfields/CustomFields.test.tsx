import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomFields } from './CustomFields';
import type { CustomFieldRecord } from '../../lib/dataClient';

const fields = [
  { id: 'f1', name: 'Size', fieldType: 'TEXT' } as CustomFieldRecord,
  { id: 'f2', name: 'Team', fieldType: 'TEXT' } as CustomFieldRecord,
];

describe('CustomFields', () => {
  it('renders a row per field with its current value', () => {
    render(
      <CustomFields
        fields={fields}
        values={{ f1: 'Large' }}
        onSetValue={vi.fn()}
        onAddField={vi.fn()}
      />,
    );
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect((screen.getByTestId('custom-field-input-f1') as HTMLInputElement).value).toBe('Large');
  });

  it('reports a value edit on blur', () => {
    const onSetValue = vi.fn();
    render(
      <CustomFields fields={fields} values={{}} onSetValue={onSetValue} onAddField={vi.fn()} />,
    );
    const input = screen.getByTestId('custom-field-input-f2');
    fireEvent.change(input, { target: { value: 'Platform' } });
    fireEvent.blur(input);
    expect(onSetValue).toHaveBeenCalledWith('f2', 'Platform');
  });

  it('adds a TEXT field on Enter', () => {
    const onAddField = vi.fn();
    render(<CustomFields fields={[]} values={{}} onSetValue={vi.fn()} onAddField={onAddField} />);
    const input = screen.getByTestId('custom-field-name');
    fireEvent.change(input, { target: { value: 'Priority note' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddField).toHaveBeenCalledWith({
      name: 'Priority note',
      fieldType: 'TEXT',
      options: undefined,
    });
  });

  it('renders a SELECT field as a dropdown of its options', () => {
    const onSetValue = vi.fn();
    render(
      <CustomFields
        fields={[
          {
            id: 'f1',
            name: 'Stage',
            fieldType: 'SELECT',
            options: ['Todo', 'Doing'],
          } as CustomFieldRecord,
        ]}
        values={{ f1: 'Doing' }}
        onSetValue={onSetValue}
        onAddField={vi.fn()}
      />,
    );
    const select = screen.getByTestId('custom-field-input-f1') as HTMLSelectElement;
    expect(select.value).toBe('Doing');
    fireEvent.change(select, { target: { value: 'Todo' } });
    expect(onSetValue).toHaveBeenCalledWith('f1', 'Todo');
  });

  it('renders NUMBER and DATE fields with the matching input type', () => {
    render(
      <CustomFields
        fields={[
          { id: 'n', name: 'Estimate', fieldType: 'NUMBER' } as CustomFieldRecord,
          { id: 'd', name: 'Ship by', fieldType: 'DATE' } as CustomFieldRecord,
        ]}
        values={{}}
        onSetValue={vi.fn()}
        onAddField={vi.fn()}
      />,
    );
    expect(screen.getByTestId('custom-field-input-n')).toHaveAttribute('type', 'number');
    expect(screen.getByTestId('custom-field-input-d')).toHaveAttribute('type', 'date');
  });
});
