import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't1',
    title: 'Write spec',
    status: 'TODO',
    priority: 'NONE',
    dueDate: null,
    ...over,
  }) as TaskRecord;

describe('TaskCard', () => {
  it('renders the title', () => {
    renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.getByText('Write spec')).toBeInTheDocument();
  });

  it('shows a priority chip when set', () => {
    renderWithProviders(<TaskCard task={task({ priority: 'HIGH' })} onToggleDone={vi.fn()} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('marks done with a strike class', () => {
    renderWithProviders(<TaskCard task={task({ status: 'DONE' })} onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('task-card').className).toContain('task-card--done');
  });

  it('fires onToggleDone when the check is clicked', () => {
    const onToggle = vi.fn();
    renderWithProviders(<TaskCard task={task({})} onToggleDone={onToggle} />);
    fireEvent.click(screen.getByTestId('task-check'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows a due chip when a due date is present', () => {
    renderWithProviders(<TaskCard task={task({ dueDate: '2000-01-01' })} onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('task-due')).toBeInTheDocument();
  });

  it('shows a Blocked badge only when blocked', () => {
    const { rerender } = renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.queryByTestId('task-blocked')).not.toBeInTheDocument();
    rerender(<TaskCard task={task({})} blocked onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('task-blocked')).toBeInTheDocument();
  });

  it('shows a color accent stripe only when a color is set', () => {
    const { rerender } = renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('task-card')).not.toHaveAttribute('data-colored');
    rerender(<TaskCard task={task({ color: 'sky' })} onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('task-card')).toHaveAttribute('data-colored', 'true');
  });

  it('has an open-task control that is clickable', () => {
    renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    const open = screen.getByTestId('task-open');
    expect(open).toBeInTheDocument();
    fireEvent.click(open); // navigates via history.push — no throw
  });

  it('shows quick-edit controls only when onQuickEdit is given', () => {
    const { rerender } = renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.queryByTestId('quick-edit')).not.toBeInTheDocument();
    const onQuickEdit = vi.fn();
    rerender(<TaskCard task={task({})} onToggleDone={vi.fn()} onQuickEdit={onQuickEdit} />);
    fireEvent.click(screen.getByTestId('quick-edit-priority'));
    expect(onQuickEdit).toHaveBeenCalledWith({ priority: 'LOW' });
  });

  it('shows reorder controls only when onReorder is given', () => {
    const { rerender } = renderWithProviders(<TaskCard task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.queryByTestId('reorder')).not.toBeInTheDocument();
    const onReorder = vi.fn();
    rerender(<TaskCard task={task({})} onToggleDone={vi.fn()} onReorder={onReorder} />);
    fireEvent.click(screen.getByTestId('reorder-up'));
    expect(onReorder).toHaveBeenCalledWith('up');
  });
});
