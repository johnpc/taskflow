import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useListSort } from './useListSort';

beforeEach(() => localStorage.clear());

describe('useListSort', () => {
  it('activates a column ascending then flips on repeat, persisting', () => {
    const { result } = renderHook(() => useListSort('p'));
    expect(result.current.sort).toEqual({ key: 'manual', dir: 'asc' });
    act(() => result.current.toggle('due'));
    expect(result.current.sort).toEqual({ key: 'due', dir: 'asc' });
    act(() => result.current.toggle('due'));
    expect(result.current.sort).toEqual({ key: 'due', dir: 'desc' });
    expect(localStorage.getItem('tf-listsort-p')).toBe('due:desc');
  });
});
