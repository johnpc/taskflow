import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBoardFilter } from './useBoardFilter';

describe('useBoardFilter', () => {
  it('starts with the default filter', () => {
    const { result } = renderHook(() => useBoardFilter());
    expect(result.current.filter.hideDone).toBe(true);
    expect(result.current.filter.sort).toBe('manual');
  });

  it('applies partial updates', () => {
    const { result } = renderHook(() => useBoardFilter());
    act(() => result.current.update({ hideDone: false }));
    expect(result.current.filter.hideDone).toBe(false);
    act(() => result.current.update({ sort: 'due' }));
    expect(result.current.filter.sort).toBe('due');
    // Prior update is preserved.
    expect(result.current.filter.hideDone).toBe(false);
  });
});
