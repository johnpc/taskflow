import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DueDateRow } from './DueDateRow';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', priority: 'NONE', dueDate: null, dueTime: null, ...over }) as TaskRecord;

describe('DueDateRow', () => {
  it('patches the due date and resets the time', () => {
    const onPatch = vi.fn();
    render(<DueDateRow task={task({})} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-due-input'), { target: { value: '2026-08-01' } });
    expect(onPatch).toHaveBeenCalledWith({ dueDate: '2026-08-01', dueTime: null });
  });

  it('disables the time until a date is set, then patches it', () => {
    const onPatch = vi.fn();
    const { rerender } = render(<DueDateRow task={task({})} onPatch={onPatch} />);
    expect(screen.getByTestId('task-due-time')).toBeDisabled();
    rerender(<DueDateRow task={task({ dueDate: '2026-08-01' })} onPatch={onPatch} />);
    const time = screen.getByTestId('task-due-time');
    expect(time).not.toBeDisabled();
    fireEvent.change(time, { target: { value: '09:30' } });
    expect(onPatch).toHaveBeenCalledWith({ dueTime: '09:30' });
  });

  it('flags an overdue date red, not a far-future one', () => {
    const { rerender } = render(
      <DueDateRow task={task({ dueDate: '2000-01-01' })} onPatch={vi.fn()} />,
    );
    expect(screen.getByTestId('task-due-input')).toHaveClass('task-fields__date--overdue');
    rerender(<DueDateRow task={task({ dueDate: '2999-01-01' })} onPatch={vi.fn()} />);
    expect(screen.getByTestId('task-due-input')).not.toHaveClass('task-fields__date--overdue');
  });

  it('sets the due date from a preset', () => {
    const onPatch = vi.fn();
    render(<DueDateRow task={task({})} onPatch={onPatch} />);
    fireEvent.click(screen.getByTestId('due-preset-today'));
    expect(onPatch).toHaveBeenCalledWith({ dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });
  });
});
