import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const { setProjectMembers } = vi.hoisted(() => ({ setProjectMembers: vi.fn() }));
vi.mock('../projects/projectMembersApi', () => ({ setProjectMembers }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProjectMembers } from './useProjectMembers';

beforeEach(() => {
  setProjectMembers.mockReset();
  setProjectMembers.mockResolvedValue(undefined);
});

describe('useProjectMembers', () => {
  it('adds a member by computing the new list', async () => {
    const { result } = renderHook(() => useProjectMembers('p', ['owner@x.co']), {
      wrapper: hookWrapper(),
    });
    act(() => result.current.add('alice@x.co'));
    await waitFor(() =>
      expect(setProjectMembers).toHaveBeenCalledWith('p', ['owner@x.co', 'alice@x.co']),
    );
  });

  it('removes a member (never the owner)', async () => {
    const { result } = renderHook(() => useProjectMembers('p', ['owner@x.co', 'alice@x.co']), {
      wrapper: hookWrapper(),
    });
    act(() => result.current.remove('alice@x.co'));
    await waitFor(() => expect(setProjectMembers).toHaveBeenCalledWith('p', ['owner@x.co']));
  });
});
