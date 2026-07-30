import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGroupBy } from './useGroupBy';

beforeEach(() => localStorage.clear());

describe('useGroupBy', () => {
  it('seeds from storage and persists a new choice', () => {
    const { result } = renderHook(() => useGroupBy('p'));
    expect(result.current.groupBy).toBe('SECTION');
    act(() => result.current.choose('ASSIGNEE'));
    expect(result.current.groupBy).toBe('ASSIGNEE');
    expect(localStorage.getItem('tf-groupby-p')).toBe('ASSIGNEE');
  });
});
