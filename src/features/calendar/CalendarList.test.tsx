import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useCalendar } = vi.hoisted(() => ({ useCalendar: vi.fn() }));
vi.mock('./useCalendar', () => ({ useCalendar }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { CalendarList } from './CalendarList';

beforeEach(() => useCalendar.mockReset());

describe('CalendarList', () => {
  it('renders day groups with their tasks', () => {
    useCalendar.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      days: [{ date: '2026-07-31', label: 'Tomorrow', tasks: [{ id: 't', title: 'Ship it' }] }],
      atStart: true,
    });
    renderWithProviders(<CalendarList />);
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
  });

  it('accents the Today group header, not other days', () => {
    useCalendar.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      days: [
        { date: '2026-08-03', label: 'Today', isToday: true, tasks: [{ id: 'a', title: 'Now' }] },
        {
          date: '2026-08-04',
          label: 'Tomorrow',
          isToday: false,
          tasks: [{ id: 'b', title: 'Next' }],
        },
      ],
      atStart: true,
    });
    renderWithProviders(<CalendarList />);
    // Scope to the group headings — "Today" also appears as the nav button label.
    expect(screen.getByRole('heading', { name: 'Today' })).toHaveClass('calendar__day-head--today');
    expect(screen.getByRole('heading', { name: 'Tomorrow' })).not.toHaveClass(
      'calendar__day-head--today',
    );
  });

  it('shows the empty state when nothing is scheduled', () => {
    useCalendar.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      days: [],
      atStart: true,
    });
    renderWithProviders(<CalendarList />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
