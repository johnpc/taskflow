import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  it('toggles ids and tracks active/count', () => {
    const { result } = renderHook(() => useSelection());
    expect(result.current.active).toBe(false);
    act(() => result.current.toggle('a'));
    act(() => result.current.toggle('b'));
    expect(result.current.count).toBe(2);
    expect(result.current.active).toBe(true);
    act(() => result.current.toggle('a'));
    expect(result.current.count).toBe(1);
  });

  it('clears the selection', () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.toggle('a'));
    act(() => result.current.clear());
    expect(result.current.count).toBe(0);
  });
});
