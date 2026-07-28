import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ListSection } from './ListSection';
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

describe('ListSection', () => {
  it('renders the section name, count, and rows when open', () => {
    renderWithProviders(
      <ListSection
        column={column([task({ id: 'a', title: 'Alpha' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('collapses and expands on the header toggle', () => {
    renderWithProviders(
      <ListSection
        column={column([task({ id: 'a', title: 'Alpha' })])}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('list-section-toggle'));
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('list-section-toggle'));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('adds a task with the next order', () => {
    const onAddTask = vi.fn();
    renderWithProviders(
      <ListSection
        column={column([task({ id: 'a', sortOrder: 4 })])}
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
});
