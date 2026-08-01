import { useSelection } from './useSelection';
import { nowISO } from '../task/today';
import type { Priority } from '../task/taskMeta';
import type { useBoard } from './useBoard';

/** Bundles multi-select state with the board's bulk mutations into ready
 * handlers for the SelectionBar — complete/delete the selected ids, then clear.
 * Keeps ProjectView thin. */
export function useBulkSelection(board: ReturnType<typeof useBoard>) {
  const selection = useSelection();

  const completeSelected = () => {
    board.bulkComplete.mutate({ ids: [...selection.ids], now: nowISO() });
    selection.clear();
  };
  const deleteSelected = () => {
    board.bulkDelete.mutate([...selection.ids]);
    selection.clear();
  };
  const moveSelected = (sectionId: string) => {
    board.bulkMove.mutate({ ids: [...selection.ids], sectionId });
    selection.clear();
  };
  const assignSelected = (assigneeEmail: string | null) => {
    board.bulkAssign.mutate({ ids: [...selection.ids], assigneeEmail });
    selection.clear();
  };
  const prioritizeSelected = (priority: Priority) => {
    board.bulkPriority.mutate({ ids: [...selection.ids], priority });
    selection.clear();
  };
  const labelSelected = (labelId: string) => {
    board.bulkLabel.mutate({ ids: [...selection.ids], labelId });
    selection.clear();
  };
  const unlabelSelected = (labelId: string) => {
    board.bulkUnlabel.mutate({ ids: [...selection.ids], labelId });
    selection.clear();
  };

  return {
    selection,
    completeSelected,
    deleteSelected,
    moveSelected,
    assignSelected,
    prioritizeSelected,
    labelSelected,
    unlabelSelected,
  };
}
