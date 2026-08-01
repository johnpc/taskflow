import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyTasksSort } from './MyTasksSort';

describe('MyTasksSort', () => {
  it('hides the direction toggle on manual and reports a chosen column', () => {
    const onChange = vi.fn();
    render(<MyTasksSort sort={{ key: 'manual', dir: 'asc' }} onChange={onChange} />);
    expect(screen.queryByTestId('mytasks-sort-dir')).not.toBeInTheDocument();
    fireEvent.change(screen.getByTestId('mytasks-sort-key'), { target: { value: 'due' } });
    expect(onChange).toHaveBeenCalledWith({ key: 'due', dir: 'asc' });
  });

  it('flips direction with the toggle when a column is active', () => {
    const onChange = vi.fn();
    render(<MyTasksSort sort={{ key: 'due', dir: 'asc' }} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('mytasks-sort-dir'));
    expect(onChange).toHaveBeenCalledWith({ key: 'due', dir: 'desc' });
  });
});
