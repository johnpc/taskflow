import { TaskCard } from '../task/TaskCard';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { Column } from './taskGrouping';
import type { QuickEditFn, BoardDrag } from './boardHandlers';
import type { SubProgress } from '../task/subtaskProgress';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** The task-card list inside a board column. Extracted from BoardColumn so each
 * component stays simple (low branch count). Wires each card's toggle / reorder
 * / quick-edit / drag handlers to the column-level callbacks. */
export function ColumnCards({
  column,
  labels,
  blockedIds,
  subtaskProgress,
  onToggleDone,
  onReorder,
  onQuickEdit,
  drag,
}: {
  column: Column;
  labels: LabelRecord[];
  blockedIds?: Set<string>;
  subtaskProgress?: Map<string, SubProgress>;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onReorder?: (input: {
    columnTasks: TaskRecord[];
    taskId: string;
    direction: 'up' | 'down';
  }) => void;
  onQuickEdit?: QuickEditFn;
  drag?: BoardDrag;
}) {
  return (
    <ul className="board-col__list">
      {column.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          labels={resolveLabels(task.labelIds, labels)}
          blocked={blockedIds?.has(task.id)}
          subtasks={subtaskProgress?.get(task.id)}
          onToggleDone={(t) => onToggleDone({ id: t.id, done: t.status !== 'DONE', now: nowISO() })}
          onReorder={
            onReorder &&
            ((direction) => onReorder({ columnTasks: column.tasks, taskId: task.id, direction }))
          }
          onQuickEdit={onQuickEdit && ((patch) => onQuickEdit(task.id, patch))}
          onDragStart={drag && (() => drag.onStart(task.id))}
          onDragEnd={drag && drag.onEnd}
          onDropTask={drag && (() => drag.onDropToTask(task.id))}
        />
      ))}
    </ul>
  );
}
