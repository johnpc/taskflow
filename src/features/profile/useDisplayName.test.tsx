import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const { fetchProfile, saveDisplayName } = vi.hoisted(() => ({
  fetchProfile: vi.fn(),
  saveDisplayName: vi.fn(),
}));
vi.mock('./userProfileApi', () => ({ fetchProfile, saveDisplayName }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'a@x.co' }) }));

import { hookWrapper } from '../../test/hookWrapper';
import { useDisplayName } from './useDisplayName';

beforeEach(() => {
  fetchProfile.mockReset();
  saveDisplayName.mockReset().mockResolvedValue(undefined);
});

describe('useDisplayName', () => {
  it('seeds the draft from the loaded profile name', async () => {
    fetchProfile.mockResolvedValue({ email: 'a@x.co', displayName: 'Ada' });
    const { result } = renderHook(() => useDisplayName(), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.draft).toBe('Ada'));
    expect(result.current.saved).toBe('Ada');
  });

  it('saves the draft via the api', async () => {
    fetchProfile.mockResolvedValue(null);
    const { result } = renderHook(() => useDisplayName(), { wrapper: hookWrapper() });
    await act(async () => {
      await result.current.save.mutateAsync('Grace');
    });
    expect(saveDisplayName).toHaveBeenCalledWith('a@x.co', 'Grace');
  });
});
