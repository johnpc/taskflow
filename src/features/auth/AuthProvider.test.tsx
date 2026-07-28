import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { currentEmail, signIn, signOut } = vi.hoisted(() => ({
  currentEmail: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('./authClient', () => ({
  currentEmail,
  signIn,
  signOut,
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
}));

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function Probe() {
  const { status, email, signOut: doSignOut } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="email">{email ?? 'none'}</span>
      <button data-testid="out" onClick={doSignOut}>
        out
      </button>
    </div>
  );
}

beforeEach(() => {
  currentEmail.mockReset();
  signOut.mockReset();
});

describe('AuthProvider', () => {
  it('resolves to authenticated when a session exists', async () => {
    currentEmail.mockResolvedValue('a@b.co');
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('email')).toHaveTextContent('a@b.co');
  });

  it('resolves to unauthenticated with no session', async () => {
    currentEmail.mockResolvedValue(null);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
  });

  it('clears state on sign out', async () => {
    currentEmail.mockResolvedValue('a@b.co');
    signOut.mockResolvedValue(undefined);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    fireEvent.click(screen.getByTestId('out'));
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'));
  });
});
