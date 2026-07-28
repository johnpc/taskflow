import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewMode } from './useViewMode';

describe('useViewMode', () => {
  beforeEach(() => localStorage.clear());

  it('seeds from the project default', () => {
    const { result } = renderHook(() => useViewMode('p1', 'LIST'));
    expect(result.current.mode).toBe('LIST');
  });

  it('persists + applies a chosen mode', () => {
    const { result } = renderHook(() => useViewMode('p1', 'BOARD'));
    act(() => result.current.choose('LIST'));
    expect(result.current.mode).toBe('LIST');
    expect(localStorage.getItem('tf-view-p1')).toBe('LIST');
  });

  it('prefers an explicit stored choice over the project default', () => {
    localStorage.setItem('tf-view-p1', 'LIST');
    const { result } = renderHook(() => useViewMode('p1', 'BOARD'));
    expect(result.current.mode).toBe('LIST');
  });
});
