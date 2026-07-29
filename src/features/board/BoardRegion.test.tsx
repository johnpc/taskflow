import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { BoardRegion } from './BoardRegion';
import { ToastProvider } from '../shell/ToastProvider';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';
import type { useBoard } from './useBoard';
import type { useBulkSelection } from './useBulkSelection';

const renderRegion = (board: ReturnType<typeof useBoard>, mode: 'BOARD' | 'LIST', b = bulk) =>
  renderWithProviders(
    <ToastProvider>
      <BoardRegion board={board} mode={mode} bulk={b} />
    </ToastProvider>,
  );

const col = (id: string, tasks: TaskRecord[]) => ({
  section: { id, name: id } as SectionRecord,
  tasks,
});

function fakeBoard(quickEdit = { mutate: vi.fn() }) {
  return {
    query: { isLoading: false, isError: false, refetch: vi.fn() },
    columns: [col('s1', [{ id: 'a', sortOrder: 0 } as TaskRecord]), col('s2', [])],
    labels: [],
    addTask: { mutate: vi.fn() },
    toggleDone: { mutate: vi.fn() },
    reorder: { mutate: vi.fn() },
    quickEdit,
    editSection: { mutate: vi.fn() },
    removeSection: { mutate: vi.fn() },
    moveSection: { mutate: vi.fn() },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as ReturnType<typeof useBoard>;
}
const bulk = {
  selection: { ids: new Set<string>(), toggle: vi.fn(), clear: vi.fn(), count: 0, active: false },
  completeSelected: vi.fn(),
  deleteSelected: vi.fn(),
} as unknown as ReturnType<typeof useBulkSelection>;

describe('BoardRegion drag-and-drop', () => {
  it('moves a dragged task to the dropped column via quickEdit', () => {
    const quickEdit = { mutate: vi.fn() };
    renderRegion(fakeBoard(quickEdit), 'BOARD');
    const [s1, s2] = screen.getAllByTestId('board-column');
    // Drag card 'a' (in s1), drop on s2.
    fireEvent.dragStart(s1.querySelector('[data-testid="task-card"]')!);
    fireEvent.drop(s2);
    expect(quickEdit.mutate).toHaveBeenCalledWith({ id: 'a', sectionId: 's2', sortOrder: 0 });
  });

  it('does not patch when dropped on the same column', () => {
    const quickEdit = { mutate: vi.fn() };
    renderRegion(fakeBoard(quickEdit), 'BOARD');
    const [s1] = screen.getAllByTestId('board-column');
    fireEvent.dragStart(s1.querySelector('[data-testid="task-card"]')!);
    fireEvent.drop(s1);
    expect(quickEdit.mutate).not.toHaveBeenCalled();
  });

  it('reorders when a card is dropped onto another card', () => {
    const quickEdit = { mutate: vi.fn() };
    const board = fakeBoard(quickEdit);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (board as any).columns = [
      col('s1', [
        { id: 'a', sectionId: 's1', sortOrder: 0 } as TaskRecord,
        { id: 'b', sectionId: 's1', sortOrder: 1 } as TaskRecord,
      ]),
    ];
    renderRegion(board, 'BOARD');
    const cards = screen.getAllByTestId('task-card');
    fireEvent.dragStart(cards[1]); // drag 'b'
    fireEvent.drop(cards[0]); // onto 'a' → b before a
    expect(quickEdit.mutate).toHaveBeenCalledWith({ id: 'b', sectionId: 's1', sortOrder: 0 });
    expect(quickEdit.mutate).toHaveBeenCalledWith({ id: 'a', sectionId: 's1', sortOrder: 1 });
  });

  it('shows an undo toast when a task is completed', () => {
    const board = fakeBoard();
    renderRegion(board, 'BOARD');
    fireEvent.click(screen.getAllByTestId('task-check')[0]);
    expect(screen.getByTestId('undo-toast')).toBeInTheDocument();
    // Undo re-opens the task (a second toggleDone with done:false).
    fireEvent.click(screen.getByTestId('undo-toast-action'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((board.toggleDone.mutate as any).mock.calls.pop()[0]).toMatchObject({ done: false });
  });
});
