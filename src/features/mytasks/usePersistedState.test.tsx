import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistedState } from './usePersistedState';

describe('usePersistedState', () => {
  it('seeds from the reader and writes through on set', () => {
    const write = vi.fn();
    const { result } = renderHook(() => usePersistedState(() => 'a', write));
    expect(result.current[0]).toBe('a');
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(write).toHaveBeenCalledWith('b');
  });
});
