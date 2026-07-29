import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useHome } = vi.hoisted(() => ({ useHome: vi.fn() }));
vi.mock('./useHome', () => ({ useHome }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'sam@x.co' }) }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Home } from './Home';

beforeEach(() => useHome.mockReset());

describe('Home', () => {
  it('greets the user and shows summary + project links', () => {
    useHome.mockReturnValue({
      tasks: { isLoading: false, isError: false, refetch: vi.fn() },
      projects: { data: [{ id: 'p', name: 'Launch' }] },
      summary: { today: [], overdue: 0, upcoming: [] },
    });
    renderWithProviders(<Home />);
    expect(screen.getByTestId('home-greeting')).toHaveTextContent('sam');
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });
});
