import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BoardColumnHead } from './BoardColumnHead';
import type { Column } from './taskGrouping';

const column = (): Column =>
  ({ section: { id: 's1', name: 'To do' }, tasks: [{ id: 't1' }, { id: 't2' }] }) as Column;

describe('BoardColumnHead', () => {
  it('shows the section name + task count and toggles on click', () => {
    const onToggle = vi.fn();
    render(<BoardColumnHead column={column()} open onToggle={onToggle} />);
    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('board-col-toggle'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('labels the toggle by open state', () => {
    const { rerender } = render(<BoardColumnHead column={column()} open onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Collapse To do')).toBeInTheDocument();
    rerender(<BoardColumnHead column={column()} open={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Expand To do')).toBeInTheDocument();
  });

  it('wires the section actions to the section id', () => {
    const onRename = vi.fn();
    const onDelete = vi.fn();
    render(
      <BoardColumnHead
        column={column()}
        open
        onToggle={vi.fn()}
        sections={{ onRename, onDuplicate: vi.fn(), onDelete, onMove: vi.fn() }}
      />,
    );
    fireEvent.click(screen.getByTestId('section-delete'));
    expect(onDelete).toHaveBeenCalledWith('s1');
  });
});
