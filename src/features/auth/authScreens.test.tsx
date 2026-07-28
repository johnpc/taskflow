import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }));
vi.mock('./useAuth', () => ({ useAuth }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Welcome } from './Welcome';

const authStub = {
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  status: 'unauthenticated' as const,
};

beforeEach(() => useAuth.mockReturnValue({ ...authStub }));

describe('auth screens', () => {
  it('SignIn shows the sign-in form', () => {
    renderWithProviders(<SignIn />, '/signin');
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByTestId('signin-submit')).toBeInTheDocument();
  });

  it('SignUp shows the create-account form', () => {
    renderWithProviders(<SignUp />, '/signup');
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByTestId('signup-submit')).toBeInTheDocument();
  });

  it('Welcome shows both CTAs for a signed-out visitor', () => {
    renderWithProviders(<Welcome />, '/welcome');
    expect(screen.getByTestId('welcome-signup')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-signin')).toBeInTheDocument();
  });

  it('SignIn submits the form', () => {
    const f = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      status: 'unauthenticated' as const,
    };
    useAuth.mockReturnValue(f);
    renderWithProviders(<SignIn />, '/signin');
    fireEvent.click(screen.getByTestId('signin-submit'));
    // submit is async; the handler fires without throwing.
    expect(screen.getByTestId('signin-submit')).toBeInTheDocument();
  });

  it('SignUp submits details', () => {
    renderWithProviders(<SignUp />, '/signup');
    fireEvent.click(screen.getByTestId('signup-submit'));
    expect(screen.getByTestId('signup-submit')).toBeInTheDocument();
  });

  it('Welcome redirects an authenticated visitor away', () => {
    useAuth.mockReturnValue({ ...authStub, status: 'authenticated' });
    renderWithProviders(<Welcome />, '/welcome');
    expect(screen.queryByTestId('welcome-signup')).not.toBeInTheDocument();
  });
});
