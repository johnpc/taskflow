import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useMyTasks } = vi.hoisted(() => ({ useMyTasks: vi.fn() }));
vi.mock('./useMyTasks', () => ({ useMyTasks }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { MyTasks } from './MyTasks';

beforeEach(() => useMyTasks.mockReset());

describe('MyTasks', () => {
  it('renders due buckets with their tasks', () => {
    useMyTasks.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      buckets: [
        {
          key: 'today',
          label: 'Today',
          tasks: [{ id: 't', title: 'Ship it', status: 'TODO', priority: 'NONE', dueDate: null }],
        },
      ],
      overdue: 2,
      toggleDone: { mutate: vi.fn() },
    });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('bucket-today')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
    expect(screen.getByTestId('mytasks-overdue')).toHaveTextContent('2 overdue');
  });

  it('shows the caught-up empty state', () => {
    useMyTasks.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      buckets: [],
      overdue: 0,
      toggleDone: { mutate: vi.fn() },
    });
    renderWithProviders(<MyTasks />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
