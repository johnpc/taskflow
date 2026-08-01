import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { CalendarCell } from './CalendarCell';
import type { MonthCell } from './monthGrid';
import type { TaskRecord } from '../../lib/dataClient';

const t = (id: string, title: string): TaskRecord => ({ id, title }) as TaskRecord;
const cell = (over: Partial<MonthCell>): MonthCell => ({
  date: '2026-08-15',
  day: 15,
  inMonth: true,
  isToday: false,
  tasks: [],
  ...over,
});

describe('CalendarCell', () => {
  it('shows the day number and up to three task chips', () => {
    renderWithProviders(<CalendarCell cell={cell({ tasks: [t('a', 'Alpha'), t('b', 'Beta')] })} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getAllByTestId('calendar-task')).toHaveLength(2);
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it('caps at three chips and shows a "+N more" marker', () => {
    const tasks = [t('a', 'A'), t('b', 'B'), t('c', 'C'), t('d', 'D'), t('e', 'E')];
    renderWithProviders(<CalendarCell cell={cell({ tasks })} />);
    expect(screen.getAllByTestId('calendar-task')).toHaveLength(3);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('flags today and mutes spill-over days', () => {
    const { rerender } = renderWithProviders(<CalendarCell cell={cell({ isToday: true })} />);
    expect(screen.getByTestId('cell-2026-08-15')).toHaveClass('calendar-cell--today');
    rerender(<CalendarCell cell={cell({ inMonth: false })} />);
    expect(screen.getByTestId('cell-2026-08-15')).toHaveClass('calendar-cell--muted');
  });

  it('starts a drag from a chip and drops onto the day when drag is given', () => {
    const drag = { onStart: vi.fn(), onEnd: vi.fn(), onDropOnDay: vi.fn() };
    renderWithProviders(<CalendarCell cell={cell({ tasks: [t('a', 'Alpha')] })} drag={drag} />);
    fireEvent.dragStart(screen.getByTestId('calendar-task'));
    expect(drag.onStart).toHaveBeenCalledWith('a', '2026-08-15');
    fireEvent.drop(screen.getByTestId('cell-2026-08-15'));
    expect(drag.onDropOnDay).toHaveBeenCalledWith('2026-08-15');
  });
});
