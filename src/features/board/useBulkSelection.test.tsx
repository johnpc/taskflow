import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkSelection } from './useBulkSelection';
import type { useBoard } from './useBoard';

function fakeBoard() {
  return {
    bulkComplete: { mutate: vi.fn() },
    bulkMove: { mutate: vi.fn() },
    bulkAssign: { mutate: vi.fn() },
    bulkPriority: { mutate: vi.fn() },
    bulkDelete: { mutate: vi.fn() },
  } as unknown as ReturnType<typeof useBoard>;
}

describe('useBulkSelection', () => {
  it('completes the selected ids then clears', () => {
    const board = fakeBoard();
    const { result } = renderHook(() => useBulkSelection(board));
    act(() => result.current.selection.toggle('a'));
    act(() => result.current.completeSelected());
    expect(board.bulkComplete.mutate).toHaveBeenCalledWith(expect.objectContaining({ ids: ['a'] }));
    expect(result.current.selection.count).toBe(0);
  });

  it('deletes the selected ids then clears', () => {
    const board = fakeBoard();
    const { result } = renderHook(() => useBulkSelection(board));
    act(() => result.current.selection.toggle('x'));
    act(() => result.current.deleteSelected());
    expect(board.bulkDelete.mutate).toHaveBeenCalledWith(['x']);
    expect(result.current.selection.count).toBe(0);
  });

  it('moves the selected ids to a section then clears', () => {
    const board = fakeBoard();
    const { result } = renderHook(() => useBulkSelection(board));
    act(() => result.current.selection.toggle('m'));
    act(() => result.current.moveSelected('s2'));
    expect(board.bulkMove.mutate).toHaveBeenCalledWith({ ids: ['m'], sectionId: 's2' });
    expect(result.current.selection.count).toBe(0);
  });

  it('assigns the selected ids to a member then clears', () => {
    const board = fakeBoard();
    const { result } = renderHook(() => useBulkSelection(board));
    act(() => result.current.selection.toggle('n'));
    act(() => result.current.assignSelected('sam@x.co'));
    expect(board.bulkAssign.mutate).toHaveBeenCalledWith({ ids: ['n'], assigneeEmail: 'sam@x.co' });
    expect(result.current.selection.count).toBe(0);
  });

  it('sets the priority of the selected ids then clears', () => {
    const board = fakeBoard();
    const { result } = renderHook(() => useBulkSelection(board));
    act(() => result.current.selection.toggle('q'));
    act(() => result.current.prioritizeSelected('HIGH'));
    expect(board.bulkPriority.mutate).toHaveBeenCalledWith({ ids: ['q'], priority: 'HIGH' });
    expect(result.current.selection.count).toBe(0);
  });
});
