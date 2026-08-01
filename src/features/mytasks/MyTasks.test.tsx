import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

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
  showCompleted: false,
  setShowCompleted: vi.fn(),
  assignedOnly: false,
  setAssignedOnly: vi.fn(),
  followingOnly: false,
  setFollowingOnly: vi.fn(),
  sort: { key: 'manual' as const, dir: 'asc' as const },
  setSort: vi.fn(),
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

  it('toggles show-completed', () => {
    const setShowCompleted = vi.fn();
    useMyTasks.mockReturnValue({ ...base, buckets: [], setShowCompleted });
    renderWithProviders(<MyTasks />);
    fireEvent.click(screen.getByTestId('mytasks-show-completed'));
    expect(setShowCompleted).toHaveBeenCalledWith(true);
  });

  it('toggles assigned-to-me', () => {
    const setAssignedOnly = vi.fn();
    useMyTasks.mockReturnValue({ ...base, buckets: [], setAssignedOnly });
    renderWithProviders(<MyTasks />);
    fireEvent.click(screen.getByTestId('mytasks-assigned-only'));
    expect(setAssignedOnly).toHaveBeenCalledWith(true);
  });

  it('shows the caught-up empty state', () => {
    useMyTasks.mockReturnValue({ ...base, buckets: [] });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
