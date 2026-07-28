import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { signIn, replace } = vi.hoisted(() => ({ signIn: vi.fn(), replace: vi.fn() }));
vi.mock('./useAuth', () => ({ useAuth: () => ({ signIn }) }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ replace }) }));

import { useSignInForm } from './useSignInForm';

beforeEach(() => {
  signIn.mockReset();
  replace.mockReset();
});

describe('useSignInForm', () => {
  it('signs in and redirects to projects', async () => {
    signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignInForm());
    act(() => {
      result.current.setEmail('a@b.co');
      result.current.setPassword('pw');
    });
    await act(async () => {
      await result.current.submit();
    });
    expect(signIn).toHaveBeenCalledWith('a@b.co', 'pw');
    expect(replace).toHaveBeenCalledWith('/projects');
  });

  it('surfaces an error on failure', async () => {
    signIn.mockRejectedValue(new Error('bad creds'));
    const { result } = renderHook(() => useSignInForm());
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.error).toBe('bad creds');
  });
});
