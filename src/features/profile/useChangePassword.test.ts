import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { changePassword } = vi.hoisted(() => ({ changePassword: vi.fn() }));
vi.mock('../auth/authClient', () => ({ changePassword }));

import { useChangePassword } from './useChangePassword';

beforeEach(() => changePassword.mockReset());

const enter = (
  result: { current: ReturnType<typeof useChangePassword> },
  cur: string,
  nxt: string,
) =>
  act(() => {
    result.current.setCurrent(cur);
    result.current.setNext(nxt);
  });

describe('useChangePassword', () => {
  it('updates the password and reports success', async () => {
    changePassword.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useChangePassword());
    enter(result, 'oldpass1', 'newpass123');
    await act(async () => {
      await result.current.submit();
    });
    expect(changePassword).toHaveBeenCalledWith('oldpass1', 'newpass123');
    expect(result.current.status).toBe('done');
  });

  it('reports an error when the change is rejected', async () => {
    changePassword.mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useChangePassword());
    enter(result, 'badcurrent', 'newpass123');
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.status).toBe('error');
  });

  it('rejects a too-short new password without calling Cognito', async () => {
    const { result } = renderHook(() => useChangePassword());
    enter(result, 'oldpass1', 'short');
    await act(async () => {
      await result.current.submit();
    });
    expect(changePassword).not.toHaveBeenCalled();
    expect(result.current.status).toBe('error');
  });
});
