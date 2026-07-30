import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavedViews } from './useSavedViews';
import { DEFAULT_FILTER } from './taskFilter';

beforeEach(() => localStorage.clear());

describe('useSavedViews', () => {
  it('saves + removes named views, persisting per project', () => {
    const { result } = renderHook(() => useSavedViews('p'));
    expect(result.current.views).toEqual([]);
    act(() => result.current.save('Mine', { ...DEFAULT_FILTER, assignee: 'me@x.co' }));
    expect(result.current.views.map((v) => v.name)).toEqual(['Mine']);
    expect(localStorage.getItem('tf-views-p')).toContain('me@x.co');
    act(() => result.current.remove('Mine'));
    expect(result.current.views).toEqual([]);
  });
});
