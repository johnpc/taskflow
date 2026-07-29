import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ColumnCards } from './ColumnCards';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Column } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const column = (tasks: TaskRecord[]): Column => ({
  section: { id: 's1', name: 'To do' } as SectionRecord,
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

describe('ColumnCards', () => {
  it('renders a card per task and toggles done', () => {
    const onToggleDone = vi.fn();
    renderWithProviders(
      <ColumnCards column={column([task({ id: 'a' })])} labels={[]} onToggleDone={onToggleDone} />,
    );
    fireEvent.click(screen.getByTestId('task-check'));
    expect(onToggleDone).toHaveBeenCalledWith(expect.objectContaining({ id: 'a', done: true }));
  });

  it('wires reorder + drag when provided', () => {
    const onReorder = vi.fn();
    const drag = { draggingId: null, onStart: vi.fn(), onEnd: vi.fn(), onDropToSection: vi.fn() };
    renderWithProviders(
      <ColumnCards
        column={column([task({ id: 'a', sortOrder: 1 })])}
        labels={[]}
        onToggleDone={vi.fn()}
        onReorder={onReorder}
        drag={drag}
      />,
    );
    expect(screen.getByTestId('task-card')).toHaveAttribute('draggable', 'true');
    fireEvent.dragStart(screen.getByTestId('task-card'));
    expect(drag.onStart).toHaveBeenCalledWith('a');
    fireEvent.click(screen.getByTestId('reorder-up'));
    expect(onReorder).toHaveBeenCalled();
  });
});
