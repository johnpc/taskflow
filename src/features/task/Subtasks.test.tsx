import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Subtasks } from './Subtasks';
import type { TaskRecord } from '../../lib/dataClient';

const sub = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 's', title: 'Sub', status: 'TODO', ...over }) as TaskRecord;

describe('Subtasks', () => {
  it('renders subtasks and a done count', () => {
    render(
      <Subtasks
        subtasks={[sub({ id: 'a', status: 'DONE' }), sub({ id: 'b' })]}
        onAdd={vi.fn()}
        onToggle={vi.fn()}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByTestId('subtasks-count')).toHaveTextContent('1/2');
  });

  it('toggles a subtask', () => {
    const onToggle = vi.fn();
    render(
      <Subtasks
        subtasks={[sub({ id: 'a' })]}
        onAdd={vi.fn()}
        onToggle={onToggle}
        onOpen={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('subtask-check'));
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ taskId: 'a', done: true }));
  });

  it('opens a subtask by title', () => {
    const onOpen = vi.fn();
    render(
      <Subtasks
        subtasks={[sub({ id: 'a9' })]}
        onAdd={vi.fn()}
        onToggle={vi.fn()}
        onOpen={onOpen}
      />,
    );
    fireEvent.click(screen.getByTestId('subtask-open'));
    expect(onOpen).toHaveBeenCalledWith('a9');
  });

  it('adds a subtask via the composer', () => {
    const onAdd = vi.fn();
    render(<Subtasks subtasks={[]} onAdd={onAdd} onToggle={vi.fn()} onOpen={vi.fn()} />);
    fireEvent.click(screen.getByTestId('add-card'));
    const input = screen.getByTestId('add-card-input');
    fireEvent.change(input, { target: { value: 'New sub' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith('New sub');
  });
});
