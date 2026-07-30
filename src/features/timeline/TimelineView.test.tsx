import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { TimelineView } from './TimelineView';
import { todayISO } from '../task/today';
import type { Column } from '../board/taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

/** A due date `n` days from today, so the bar lands inside the 14-day window. */
const inWindow = (n: number) => {
  const [y, m, d] = todayISO().split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

const cols = (tasks: TaskRecord[]): Column[] => [
  { section: { id: 's1', name: 'To do' } as SectionRecord, tasks },
];

describe('TimelineView', () => {
  it('renders a bar for a dated task', () => {
    renderWithProviders(
      <TimelineView
        columns={cols([
          { id: 'a', title: 'Ship it', status: 'TODO', dueDate: inWindow(2) } as TaskRecord,
        ])}
      />,
    );
    expect(screen.getByTestId('timeline-bar')).toHaveTextContent('Ship it');
  });

  it("marks today's column", () => {
    renderWithProviders(
      <TimelineView
        columns={cols([
          { id: 'a', title: 'Ship it', status: 'TODO', dueDate: inWindow(2) } as TaskRecord,
        ])}
      />,
    );
    expect(screen.getByTestId('timeline-today')).toHaveTextContent('Today');
  });

  it('reschedules a bar dragged onto a different day', () => {
    const onReschedule = vi.fn();
    renderWithProviders(
      <TimelineView
        columns={cols([
          { id: 'a', title: 'Ship it', status: 'TODO', dueDate: inWindow(2) } as TaskRecord,
        ])}
        onReschedule={onReschedule}
      />,
    );
    fireEvent.dragStart(screen.getByTestId('timeline-bar'));
    fireEvent.drop(screen.getByTestId(`timeline-day-${inWindow(5)}`));
    expect(onReschedule).toHaveBeenCalledWith({ id: 'a', dueDate: inWindow(5) });
  });

  it('shows the empty state when nothing is dated in the window', () => {
    renderWithProviders(
      <TimelineView
        columns={cols([{ id: 'a', title: 'No date', status: 'TODO', dueDate: null } as TaskRecord])}
      />,
    );
    expect(screen.getByTestId('timeline-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline-bar')).not.toBeInTheDocument();
  });
});
