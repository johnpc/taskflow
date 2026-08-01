import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendarDrag } from './useCalendarDrag';

describe('useCalendarDrag', () => {
  it('reschedules a chip dropped on a different day', () => {
    const onReschedule = vi.fn();
    const { result } = renderHook(() => useCalendarDrag(onReschedule));
    act(() => result.current.onStart('t1', '2026-08-10'));
    expect(result.current.draggingId).toBe('t1');
    act(() => result.current.onDropOnDay('2026-08-14'));
    expect(onReschedule).toHaveBeenCalledWith({ id: 't1', dueDate: '2026-08-14' });
    expect(result.current.draggingId).toBe(null);
  });

  it('is a no-op when dropped back on the same day', () => {
    const onReschedule = vi.fn();
    const { result } = renderHook(() => useCalendarDrag(onReschedule));
    act(() => result.current.onStart('t1', '2026-08-10'));
    act(() => result.current.onDropOnDay('2026-08-10'));
    expect(onReschedule).not.toHaveBeenCalled();
  });

  it('clears drag state on end', () => {
    const { result } = renderHook(() => useCalendarDrag());
    act(() => result.current.onStart('t1', '2026-08-10'));
    act(() => result.current.onEnd());
    expect(result.current.draggingId).toBe(null);
  });
});
