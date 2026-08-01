import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCollapseAll } from './useCollapseAll';
import { readCollapsed, writeCollapsed } from './sectionCollapse';

describe('useCollapseAll', () => {
  beforeEach(() => localStorage.clear());

  it('collapses every section then expands them back', () => {
    const { result } = renderHook(() => useCollapseAll(['a', 'b']));
    expect(result.current.allCollapsed).toBe(false);

    act(() => result.current.toggleAll());
    expect(result.current.allCollapsed).toBe(true);
    expect(readCollapsed('a', false)).toBe(true);
    expect(readCollapsed('b', false)).toBe(true);

    act(() => result.current.toggleAll());
    expect(result.current.allCollapsed).toBe(false);
    expect(readCollapsed('a', true)).toBe(false);
  });

  it('reacts live when a single section collapses elsewhere', () => {
    const { result } = renderHook(() => useCollapseAll(['a', 'b']));
    act(() => writeCollapsed('a', true));
    expect(result.current.allCollapsed).toBe(false); // b still open
    act(() => writeCollapsed('b', true));
    expect(result.current.allCollapsed).toBe(true);
  });
});
