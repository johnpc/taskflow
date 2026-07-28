import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }));
vi.mock('./useAuth', () => ({ useAuth }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { RequireAuth } from './RequireAuth';

beforeEach(() => useAuth.mockReset());

describe('RequireAuth', () => {
  it('shows a skeleton while loading', () => {
    useAuth.mockReturnValue({ status: 'loading' });
    renderWithProviders(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
    expect(screen.getByTestId('skeleton-rows')).toBeInTheDocument();
  });

  it('hides children when unauthenticated', () => {
    useAuth.mockReturnValue({ status: 'unauthenticated' });
    renderWithProviders(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuth.mockReturnValue({ status: 'authenticated' });
    renderWithProviders(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});
