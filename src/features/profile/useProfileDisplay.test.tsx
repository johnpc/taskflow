import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { fetchProfile } = vi.hoisted(() => ({ fetchProfile: vi.fn() }));
vi.mock('./userProfileApi', () => ({ fetchProfile }));

import { hookWrapper } from '../../test/hookWrapper';
import { useProfileDisplay } from './useProfileDisplay';

beforeEach(() => fetchProfile.mockReset());

describe('useProfileDisplay', () => {
  it('resolves the display name + initials once the profile loads', async () => {
    fetchProfile.mockResolvedValue({ email: 'a@x.co', displayName: 'Ada Lovelace' });
    const { result } = renderHook(() => useProfileDisplay('a@x.co'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.label).toBe('Ada Lovelace'));
    expect(result.current.initials).toBe('AL');
  });

  it('falls back to the email + its initials before/without a profile', () => {
    fetchProfile.mockResolvedValue(null);
    const { result } = renderHook(() => useProfileDisplay('grace.hopper@x.co'), {
      wrapper: hookWrapper(),
    });
    expect(result.current.label).toBe('grace.hopper@x.co');
    expect(result.current.initials).toBe('GH');
  });

  it('is empty for no email', () => {
    const { result } = renderHook(() => useProfileDisplay(null), { wrapper: hookWrapper() });
    expect(result.current.label).toBe('');
    expect(result.current.initials).toBe('');
  });
});
