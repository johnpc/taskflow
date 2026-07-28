import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }));
vi.mock('../auth/useAuth', () => ({ useAuth }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Profile } from './Profile';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('Profile', () => {
  it('shows the signed-in email and theme toggle', () => {
    useAuth.mockReturnValue({ email: 'me@x.co', signOut: vi.fn() });
    renderWithProviders(<Profile />);
    expect(screen.getByTestId('profile-email')).toHaveTextContent('me@x.co');
    expect(screen.getByTestId('theme-system')).toBeInTheDocument();
  });

  it('signs out on click', async () => {
    const signOut = vi.fn().mockResolvedValue(undefined);
    useAuth.mockReturnValue({ email: 'me@x.co', signOut });
    renderWithProviders(<Profile />);
    fireEvent.click(screen.getByTestId('sign-out'));
    await waitFor(() => expect(signOut).toHaveBeenCalledOnce());
  });
});
