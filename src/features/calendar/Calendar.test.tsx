import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

vi.mock('./CalendarList', () => ({ CalendarList: () => <div data-testid="cal-list" /> }));
vi.mock('./CalendarMonth', () => ({ CalendarMonth: () => <div data-testid="cal-month" /> }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to the two-week list view', () => {
    renderWithProviders(<Calendar />);
    expect(screen.getByTestId('cal-list')).toBeInTheDocument();
    expect(screen.queryByTestId('cal-month')).not.toBeInTheDocument();
    expect(screen.getByTestId('calendar-view-list')).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches to the month grid and persists the choice', () => {
    const { unmount } = renderWithProviders(<Calendar />);
    fireEvent.click(screen.getByTestId('calendar-view-month'));
    expect(screen.getByTestId('cal-month')).toBeInTheDocument();
    expect(screen.queryByTestId('cal-list')).not.toBeInTheDocument();

    unmount();
    renderWithProviders(<Calendar />);
    expect(screen.getByTestId('cal-month')).toBeInTheDocument(); // restored from storage
  });
});
