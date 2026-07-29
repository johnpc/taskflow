import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useCalendar } = vi.hoisted(() => ({ useCalendar: vi.fn() }));
vi.mock('./useCalendar', () => ({ useCalendar }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Calendar } from './Calendar';

beforeEach(() => useCalendar.mockReset());

describe('Calendar', () => {
  it('renders day groups with their tasks', () => {
    useCalendar.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      days: [{ date: '2026-07-31', label: 'Tomorrow', tasks: [{ id: 't', title: 'Ship it' }] }],
    });
    renderWithProviders(<Calendar />);
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
  });

  it('shows the empty state when nothing is scheduled', () => {
    useCalendar.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      days: [],
    });
    renderWithProviders(<Calendar />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
