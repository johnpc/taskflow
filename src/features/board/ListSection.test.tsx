import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ListSection } from './ListSection';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { ListGroup } from './listGrouping';
import type { TaskRecord } from '../../lib/dataClient';

const group = (tasks: TaskRecord[]): ListGroup => ({ id: 's1', name: 'To do', tasks });
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

describe('ListSection', () => {
  it('renders the group name, count, column header, and rows when open', () => {
    renderWithProviders(
      <ListSection
        group={group([task({ id: 'a', title: 'Alpha' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByTestId('list-head-row')).toBeInTheDocument();
  });

  it('omits the column header when the group is empty', () => {
    renderWithProviders(
      <ListSection group={group([])} onAddTask={vi.fn()} onToggleDone={vi.fn()} />,
    );
    expect(screen.queryByTestId('list-head-row')).not.toBeInTheDocument();
  });

  it('collapses and expands on the header toggle', () => {
    renderWithProviders(
      <ListSection
        group={group([task({ id: 'a', title: 'Alpha' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('list-section-toggle'));
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('list-section-toggle'));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('adds a task with the next order when onAddTask is given', () => {
    const onAddTask = vi.fn();
    renderWithProviders(
      <ListSection
        group={group([task({ id: 'a', sortOrder: 4 })])}
        onAddTask={onAddTask}
        onToggleDone={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('add-card'));
    const input = screen.getByTestId('add-card-input');
    fireEvent.change(input, { target: { value: 'New' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddTask).toHaveBeenCalledWith({ sectionId: 's1', title: 'New', order: 5 });
  });

  it('omits the add-task composer when onAddTask is not given (non-section grouping)', () => {
    renderWithProviders(<ListSection group={group([task({ id: 'a' })])} onToggleDone={vi.fn()} />);
    expect(screen.queryByTestId('add-card')).not.toBeInTheDocument();
  });
});
