import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useCompleted } = vi.hoisted(() => ({ useCompleted: vi.fn() }));
vi.mock('./useCompleted', () => ({ useCompleted }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Completed } from './Completed';

beforeEach(() => useCompleted.mockReset());

describe('Completed', () => {
  it('lists completed tasks and reopens one', () => {
    const reopen = { mutate: vi.fn() };
    useCompleted.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      done: [{ id: 't', title: 'Old task', status: 'DONE' }],
      reopen,
    });
    renderWithProviders(<Completed />, '/projects/p/completed');
    expect(screen.getByText('Old task')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('reopen-task'));
    expect(reopen.mutate).toHaveBeenCalledWith(expect.objectContaining({ id: 't' }));
  });

  it('shows the empty state', () => {
    useCompleted.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      done: [],
      reopen: { mutate: vi.fn() },
    });
    renderWithProviders(<Completed />, '/projects/p/completed');
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
