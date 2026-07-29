import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useMyTasks } = vi.hoisted(() => ({ useMyTasks: vi.fn() }));
vi.mock('./useMyTasks', () => ({ useMyTasks }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { MyTasks } from './MyTasks';

beforeEach(() => useMyTasks.mockReset());

const base = {
  query: { isLoading: false, isError: false, refetch: vi.fn() },
  overdue: 0,
  openTotal: 0,
  groupMode: 'due' as const,
  setGroupMode: vi.fn(),
  toggleDone: { mutate: vi.fn() },
  setBucket: { mutate: vi.fn() },
};

describe('MyTasks', () => {
  it('renders buckets, the open total, and the overdue chip', () => {
    useMyTasks.mockReturnValue({
      ...base,
      overdue: 2,
      openTotal: 5,
      buckets: [
        {
          key: 'today',
          label: 'Today',
          tasks: [{ id: 't', title: 'Ship it', status: 'TODO', priority: 'NONE', dueDate: null }],
        },
      ],
    });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('bucket-today')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
    expect(screen.getByTestId('mytasks-open')).toHaveTextContent('5 open');
    expect(screen.getByTestId('mytasks-overdue')).toHaveTextContent('2 overdue');
  });

  it('renders the group-by switch reflecting the current mode', () => {
    useMyTasks.mockReturnValue({ ...base, buckets: [], groupMode: 'priority' });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('mytasks-groupby')).toHaveAttribute('value', 'priority');
  });

  it('shows the caught-up empty state', () => {
    useMyTasks.mockReturnValue({ ...base, buckets: [] });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
