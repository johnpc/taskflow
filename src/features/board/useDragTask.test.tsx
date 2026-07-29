import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragTask } from './useDragTask';

describe('useDragTask', () => {
  it('tracks the dragging id and clears on end', () => {
    const { result } = renderHook(() => useDragTask());
    expect(result.current.draggingId).toBeNull();
    act(() => result.current.start('t1'));
    expect(result.current.draggingId).toBe('t1');
    act(() => result.current.end());
    expect(result.current.draggingId).toBeNull();
  });
});
