import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFields } from './TaskFields';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', priority: 'NONE', dueDate: null, notes: null, ...over }) as TaskRecord;

describe('TaskFields', () => {
  it('patches the start date', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-start-input'), { target: { value: '2026-07-30' } });
    expect(onPatch).toHaveBeenCalledWith({ startDate: '2026-07-30' });
  });

  it('patches the due date (and resets the time)', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-due-input'), { target: { value: '2026-08-01' } });
    expect(onPatch).toHaveBeenCalledWith({ dueDate: '2026-08-01', dueTime: null });
  });

  it('clears the due date to null', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({ dueDate: '2026-08-01' })} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-due-input'), { target: { value: '' } });
    expect(onPatch).toHaveBeenCalledWith({ dueDate: null, dueTime: null });
  });

  it('patches the due time and disables it without a date', () => {
    const onPatch = vi.fn();
    const { rerender } = render(<TaskFields task={task({})} onPatch={onPatch} />);
    expect(screen.getByTestId('task-due-time')).toBeDisabled();
    rerender(<TaskFields task={task({ dueDate: '2026-08-01' })} onPatch={onPatch} />);
    const time = screen.getByTestId('task-due-time');
    expect(time).not.toBeDisabled();
    fireEvent.change(time, { target: { value: '09:30' } });
    expect(onPatch).toHaveBeenCalledWith({ dueTime: '09:30' });
  });

  it('patches priority', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    fireEvent.click(screen.getByTestId('priority-high'));
    expect(onPatch).toHaveBeenCalledWith({ priority: 'HIGH' });
  });

  it('marks the current priority pressed', () => {
    render(<TaskFields task={task({ priority: 'MEDIUM' })} onPatch={vi.fn()} />);
    expect(screen.getByTestId('priority-medium')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets the due date from a preset', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    fireEvent.click(screen.getByTestId('due-preset-today'));
    expect(onPatch).toHaveBeenCalledWith({ dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });
  });

  it('patches notes on blur', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    const notes = screen.getByTestId('task-notes');
    fireEvent.change(notes, { target: { value: 'details' } });
    fireEvent.blur(notes);
    expect(onPatch).toHaveBeenCalledWith({ notes: 'details' });
  });
});
