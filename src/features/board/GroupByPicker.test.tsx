import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroupByPicker } from './GroupByPicker';

describe('GroupByPicker', () => {
  it('lists the group-by options and reflects the value', () => {
    render(<GroupByPicker value="PRIORITY" onChange={vi.fn()} />);
    const select = screen.getByTestId('list-group-by-select') as HTMLSelectElement;
    expect(select.value).toBe('PRIORITY');
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Assignee')).toBeInTheDocument();
  });

  it('reports a change', () => {
    const onChange = vi.fn();
    render(<GroupByPicker value="SECTION" onChange={onChange} />);
    fireEvent.change(screen.getByTestId('list-group-by-select'), { target: { value: 'DUE' } });
    expect(onChange).toHaveBeenCalledWith('DUE');
  });
});
