import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomFieldAdd } from './CustomFieldAdd';

describe('CustomFieldAdd', () => {
  it('adds a TEXT field with no options', () => {
    const onAdd = vi.fn();
    render(<CustomFieldAdd onAdd={onAdd} />);
    fireEvent.change(screen.getByTestId('custom-field-name'), { target: { value: 'Notes' } });
    fireEvent.click(screen.getByTestId('custom-field-add'));
    expect(onAdd).toHaveBeenCalledWith({ name: 'Notes', fieldType: 'TEXT', options: undefined });
  });

  it('adds a SELECT field, parsing comma-separated options', () => {
    const onAdd = vi.fn();
    render(<CustomFieldAdd onAdd={onAdd} />);
    fireEvent.change(screen.getByTestId('custom-field-name'), { target: { value: 'Stage' } });
    fireEvent.change(screen.getByTestId('custom-field-type'), { target: { value: 'SELECT' } });
    fireEvent.change(screen.getByTestId('custom-field-options'), {
      target: { value: 'Todo, Doing , Done' },
    });
    fireEvent.click(screen.getByTestId('custom-field-add'));
    expect(onAdd).toHaveBeenCalledWith({
      name: 'Stage',
      fieldType: 'SELECT',
      options: ['Todo', 'Doing', 'Done'],
    });
  });

  it('ignores a blank name', () => {
    const onAdd = vi.fn();
    render(<CustomFieldAdd onAdd={onAdd} />);
    fireEvent.click(screen.getByTestId('custom-field-add'));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
