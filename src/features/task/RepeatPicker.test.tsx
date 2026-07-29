import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepeatPicker } from './RepeatPicker';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', repeat: 'NONE', ...over }) as TaskRecord;

describe('RepeatPicker', () => {
  it('reflects the current rule', () => {
    render(<RepeatPicker task={task({ repeat: 'WEEKLY' })} onChange={vi.fn()} />);
    expect(screen.getByTestId('task-repeat-select')).toHaveValue('WEEKLY');
  });

  it('reports a new rule on change', () => {
    const onChange = vi.fn();
    render(<RepeatPicker task={task({})} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('task-repeat-select'), { target: { value: 'MONTHLY' } });
    expect(onChange).toHaveBeenCalledWith('MONTHLY');
  });
});
