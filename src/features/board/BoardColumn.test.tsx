import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
// Stub the card's custom-field chips (react-query fetch) for bare renders.
vi.mock('../customfields/CardCustomFieldChips', () => ({ CardCustomFieldChips: () => null }));
vi.mock('../task/CardCover', () => ({ CardCover: () => null }));
vi.mock('../task/AssigneeAvatar', () => ({ AssigneeAvatar: () => null }));
import { BoardColumn } from './BoardColumn';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Column } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const column = (tasks: TaskRecord[]): Column => ({
  section: { id: 's1', name: 'To do', sortOrder: 0 } as SectionRecord,
  tasks,
});
const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'T',
    status: 'TODO',
    priority: 'NONE',
    dueDate: null,
    sortOrder: 0,
    ...over,
  }) as TaskRecord;

describe('BoardColumn', () => {
  it('renders the section name and task count', () => {
    renderWithProviders(
      <BoardColumn
        column={column([task({ id: 'a' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByTestId('board-column')).toHaveTextContent('1');
  });

  it('adds a task with the next order', () => {
    const onAddTask = vi.fn();
    renderWithProviders(
      <BoardColumn
        column={column([task({ id: 'a', sortOrder: 2 })])}
        onAddTask={onAddTask}
        onToggleDone={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('add-card'));
    const input = screen.getByTestId('add-card-input');
    fireEvent.change(input, { target: { value: 'New' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddTask).toHaveBeenCalledWith({ sectionId: 's1', title: 'New', order: 3 });
  });

  it('toggles a card done', () => {
    const onToggleDone = vi.fn();
    renderWithProviders(
      <BoardColumn
        column={column([task({ id: 'a' })])}
        onAddTask={vi.fn()}
        onToggleDone={onToggleDone}
      />,
    );
    fireEvent.click(screen.getByTestId('task-check'));
    expect(onToggleDone).toHaveBeenCalledWith(expect.objectContaining({ id: 'a', done: true }));
  });

  it('drops a task onto the column section', () => {
    const onDropToSection = vi.fn();
    const drag = {
      draggingId: 'x',
      onStart: vi.fn(),
      onEnd: vi.fn(),
      onDropToSection,
      onDropToTask: vi.fn(),
    };
    renderWithProviders(
      <BoardColumn
        column={column([task({ id: 'a' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
        drag={drag}
      />,
    );
    fireEvent.drop(screen.getByTestId('board-column'));
    expect(onDropToSection).toHaveBeenCalledWith('s1');
  });

  it('makes cards draggable only when drag is provided', () => {
    const { rerender } = renderWithProviders(
      <BoardColumn
        column={column([task({ id: 'a' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByTestId('task-card')).not.toHaveAttribute('draggable', 'true');
    rerender(
      <BoardColumn
        column={column([task({ id: 'a' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
        drag={{
          draggingId: null,
          onStart: vi.fn(),
          onEnd: vi.fn(),
          onDropToSection: vi.fn(),
          onDropToTask: vi.fn(),
        }}
      />,
    );
    expect(screen.getByTestId('task-card')).toHaveAttribute('draggable', 'true');
  });
});
