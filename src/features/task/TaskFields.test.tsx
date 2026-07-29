import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFields } from './TaskFields';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', priority: 'NONE', dueDate: null, notes: null, ...over }) as TaskRecord;

describe('TaskFields', () => {
  it('patches the due date', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({})} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-due-input'), { target: { value: '2026-08-01' } });
    expect(onPatch).toHaveBeenCalledWith({ dueDate: '2026-08-01' });
  });

  it('clears the due date to null', () => {
    const onPatch = vi.fn();
    render(<TaskFields task={task({ dueDate: '2026-08-01' })} onPatch={onPatch} />);
    fireEvent.change(screen.getByTestId('task-due-input'), { target: { value: '' } });
    expect(onPatch).toHaveBeenCalledWith({ dueDate: null });
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
