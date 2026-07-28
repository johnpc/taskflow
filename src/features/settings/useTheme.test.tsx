import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to system (no data-theme attribute)', () => {
    renderHook(() => useTheme());
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('applies and persists an explicit choice', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.choose('dark'));
    expect(result.current.pref).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('tf-theme')).toBe('dark');
  });

  it('reads a persisted choice on mount', () => {
    localStorage.setItem('tf-theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.pref).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
