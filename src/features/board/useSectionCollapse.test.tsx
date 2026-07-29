import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSectionCollapse } from './useSectionCollapse';
import { readCollapsed } from './sectionCollapse';

describe('useSectionCollapse', () => {
  beforeEach(() => localStorage.clear());

  it('seeds from defaultOpen when there is no stored preference', () => {
    const { result } = renderHook(() => useSectionCollapse('s1', true));
    expect(result.current.open).toBe(true);
  });

  it('toggles and persists the collapsed state', () => {
    const { result } = renderHook(() => useSectionCollapse('s1', true));
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
    expect(readCollapsed('s1', true)).toBe(true); // collapsed persisted
  });

  it('seeds from the stored preference over defaultOpen', () => {
    const { result } = renderHook(() => useSectionCollapse('s2', true));
    act(() => result.current.toggle()); // collapse + persist
    const { result: reopened } = renderHook(() => useSectionCollapse('s2', true));
    expect(reopened.current.open).toBe(false);
  });
});
