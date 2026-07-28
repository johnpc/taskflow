import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { signUp, confirmSignUp, signIn, replace } = vi.hoisted(() => ({
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signIn: vi.fn(),
  replace: vi.fn(),
}));
vi.mock('./useAuth', () => ({ useAuth: () => ({ signUp, confirmSignUp, signIn }) }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ replace }) }));

import { useSignUpForm } from './useSignUpForm';

beforeEach(() => {
  signUp.mockReset();
  confirmSignUp.mockReset();
  signIn.mockReset();
  replace.mockReset();
});

describe('useSignUpForm', () => {
  it('moves to confirm phase when confirmation is required', async () => {
    signUp.mockResolvedValue({ needsConfirmation: true });
    const { result } = renderHook(() => useSignUpForm());
    await act(async () => {
      await result.current.submitDetails();
    });
    expect(result.current.phase).toBe('confirm');
  });

  it('signs in directly when no confirmation needed', async () => {
    signUp.mockResolvedValue({ needsConfirmation: false });
    signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignUpForm());
    await act(async () => {
      await result.current.submitDetails();
    });
    expect(replace).toHaveBeenCalledWith('/projects');
  });

  it('confirms the code then signs in', async () => {
    confirmSignUp.mockResolvedValue(undefined);
    signIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignUpForm());
    await act(async () => {
      await result.current.submitCode();
    });
    expect(confirmSignUp).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/projects');
  });
});
