import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskColorPicker } from './TaskColorPicker';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', color: null, ...over }) as TaskRecord;

describe('TaskColorPicker', () => {
  it('marks None when there is no color and picks a swatch', () => {
    const onChange = vi.fn();
    render(<TaskColorPicker task={task({})} onChange={onChange} />);
    expect(screen.getByTestId('task-color-none')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByTestId('task-color-sky'));
    expect(onChange).toHaveBeenCalledWith('sky');
  });

  it('marks the active swatch and clears via None', () => {
    const onChange = vi.fn();
    render(<TaskColorPicker task={task({ color: 'rose' })} onChange={onChange} />);
    expect(screen.getByTestId('task-color-rose')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('task-color-none')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByTestId('task-color-none'));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
