import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getCurrentUser, signIn, signUp, confirmSignUp, signOut } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('aws-amplify/auth', () => ({
  getCurrentUser,
  signIn,
  signUp,
  confirmSignUp,
  signOut,
}));

import * as client from './authClient';

beforeEach(() => {
  getCurrentUser.mockReset();
  signUp.mockReset();
});

describe('currentEmail', () => {
  it('prefers loginId', async () => {
    getCurrentUser.mockResolvedValue({ signInDetails: { loginId: 'a@b.co' }, username: 'u' });
    expect(await client.currentEmail()).toBe('a@b.co');
  });
  it('falls back to username', async () => {
    getCurrentUser.mockResolvedValue({ username: 'u' });
    expect(await client.currentEmail()).toBe('u');
  });
  it('returns null when signed out', async () => {
    getCurrentUser.mockRejectedValue(new Error('no user'));
    expect(await client.currentEmail()).toBeNull();
  });
});

describe('signUp', () => {
  it('maps CONFIRM_SIGN_UP to needsConfirmation', async () => {
    signUp.mockResolvedValue({ nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } });
    expect(await client.signUp('a@b.co', 'pw')).toEqual({ needsConfirmation: true });
  });
  it('maps other steps to no confirmation', async () => {
    signUp.mockResolvedValue({ nextStep: { signUpStep: 'DONE' } });
    expect(await client.signUp('a@b.co', 'pw')).toEqual({ needsConfirmation: false });
  });
});
