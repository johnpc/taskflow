import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimelineDrag } from './useTimelineDrag';
import type { TaskRecord } from '../../lib/dataClient';

const bar = { task: { id: 't', title: 'x', status: 'TODO', dueDate: '2026-08-01' } as TaskRecord };

describe('useTimelineDrag', () => {
  it('reschedules the dragged task when dropped on a new day', () => {
    const onReschedule = vi.fn();
    const { result } = renderHook(() => useTimelineDrag([bar], onReschedule));
    act(() => result.current.onStart('t'));
    expect(result.current.draggingId).toBe('t');
    act(() => result.current.onDropOnDay('2026-08-04'));
    expect(onReschedule).toHaveBeenCalledWith({ id: 't', dueDate: '2026-08-04' });
    expect(result.current.draggingId).toBeNull();
  });

  it('does nothing when dropped without dragging a bar', () => {
    const onReschedule = vi.fn();
    const { result } = renderHook(() => useTimelineDrag([bar], onReschedule));
    act(() => result.current.onDropOnDay('2026-08-04'));
    expect(onReschedule).not.toHaveBeenCalled();
  });

  it('clears the drag on end', () => {
    const { result } = renderHook(() => useTimelineDrag([bar], vi.fn()));
    act(() => result.current.onStart('t'));
    act(() => result.current.onEnd());
    expect(result.current.draggingId).toBeNull();
  });
});
