import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useCalendarMonth } = vi.hoisted(() => ({ useCalendarMonth: vi.fn() }));
vi.mock('./useCalendarMonth', () => ({ useCalendarMonth }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { CalendarMonth } from './CalendarMonth';
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

beforeEach(() => useCalendarMonth.mockReset());

describe('CalendarMonth', () => {
  it('renders the month title, weekday header, and day cells', () => {
    useCalendarMonth.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      title: 'August 2026',
      weeks: [[cell({ date: '2026-08-15', tasks: [t('a', 'Ship it')] })]],
      atStart: true,
      prevMonth: vi.fn(),
      nextMonth: vi.fn(),
      goThisMonth: vi.fn(),
    });
    renderWithProviders(<CalendarMonth />);
    expect(screen.getByText('August 2026')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-prev')).toBeDisabled(); // atStart
  });

  it('pages a month forward', () => {
    const nextMonth = vi.fn();
    useCalendarMonth.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      title: 'August 2026',
      weeks: [],
      atStart: false,
      prevMonth: vi.fn(),
      nextMonth,
      goThisMonth: vi.fn(),
    });
    renderWithProviders(<CalendarMonth />);
    fireEvent.click(screen.getByTestId('calendar-next'));
    expect(nextMonth).toHaveBeenCalledOnce();
  });
});
