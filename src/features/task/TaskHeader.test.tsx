import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskHeader } from './TaskHeader';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'Original', status: 'TODO', ...over }) as TaskRecord;

describe('TaskHeader', () => {
  it('renders the title in the input', () => {
    render(<TaskHeader task={task({})} onToggleDone={vi.fn()} onRename={vi.fn()} />);
    expect(screen.getByTestId('task-title')).toHaveValue('Original');
  });

  it('renames on blur when changed', () => {
    const onRename = vi.fn();
    render(<TaskHeader task={task({})} onToggleDone={vi.fn()} onRename={onRename} />);
    const input = screen.getByTestId('task-title');
    fireEvent.change(input, { target: { value: 'Updated' } });
    fireEvent.blur(input);
    expect(onRename).toHaveBeenCalledWith('Updated');
  });

  it('does not rename when unchanged', () => {
    const onRename = vi.fn();
    render(<TaskHeader task={task({})} onToggleDone={vi.fn()} onRename={onRename} />);
    fireEvent.blur(screen.getByTestId('task-title'));
    expect(onRename).not.toHaveBeenCalled();
  });

  it('toggles done', () => {
    const onToggle = vi.fn();
    render(<TaskHeader task={task({})} onToggleDone={onToggle} onRename={vi.fn()} />);
    fireEvent.click(screen.getByTestId('task-detail-check'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('reflects done state', () => {
    render(
      <TaskHeader task={task({ status: 'DONE' })} onToggleDone={vi.fn()} onRename={vi.fn()} />,
    );
    expect(screen.getByTestId('task-detail-check').className).toContain('--done');
  });

  it('confirms with the warning message instead of completing', async () => {
    const onToggle = vi.fn();
    render(
      <TaskHeader
        task={task({})}
        warning="It still has 2 incomplete subtasks. Complete it anyway?"
        onToggleDone={onToggle}
        onRename={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('task-detail-check'));
    expect(onToggle).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.getByText('It still has 2 incomplete subtasks. Complete it anyway?'),
      ).toBeInTheDocument(),
    );
  });

  it('completes anyway when the confirm is accepted', async () => {
    const onToggle = vi.fn();
    render(
      <TaskHeader
        task={task({})}
        warning="Not ready?"
        onToggleDone={onToggle}
        onRename={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('task-detail-check'));
    const yes = await screen.findByText('Complete anyway', {}, { timeout: 3000 });
    fireEvent.click(yes);
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true));
  });

  it('un-completing a warned task skips the confirm', () => {
    const onToggle = vi.fn();
    render(
      <TaskHeader
        task={task({ status: 'DONE' })}
        warning="Not ready?"
        onToggleDone={onToggle}
        onRename={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('task-detail-check'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
