import { TaskCard } from '../task/TaskCard';
import { AddCard } from './AddCard';
import { SectionActions } from './SectionActions';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { Column } from './taskGrouping';
import type { QuickEditFn } from './boardHandlers';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** One board column: a section header (with rename/delete), its task cards, and
 * an inline add-card composer. New cards append after the current highest
 * sortOrder. Renders + delegates its mutations up to the board hook. */
export function BoardColumn({
  column,
  labels = [],
  onAddTask,
  onToggleDone,
  onReorder,
  onQuickEdit,
  onRenameSection,
  onDeleteSection,
  onMoveSection,
}: {
  column: Column;
  labels?: LabelRecord[];
  onAddTask: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onReorder?: (input: {
    columnTasks: TaskRecord[];
    taskId: string;
    direction: 'up' | 'down';
  }) => void;
  onQuickEdit?: QuickEditFn;
  onRenameSection?: (input: { id: string; name: string }) => void;
  onDeleteSection?: (id: string) => void;
  onMoveSection?: (input: { sectionId: string; direction: 'left' | 'right' }) => void;
}) {
  const nextOrder = column.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
  return (
    <section className="board-col" data-testid="board-column" aria-label={column.section.name}>
      <header className="board-col__head">
        <span className="board-col__name">{column.section.name}</span>
        <span className="board-col__count">{column.tasks.length}</span>
        <SectionActions
          name={column.section.name}
          onRename={onRenameSection && ((name) => onRenameSection({ id: column.section.id, name }))}
          onDelete={onDeleteSection && (() => onDeleteSection(column.section.id))}
          onMove={
            onMoveSection &&
            ((direction) => onMoveSection({ sectionId: column.section.id, direction }))
          }
        />
      </header>
      <ul className="board-col__list">
        {column.tasks.map((task: TaskRecord) => (
          <TaskCard
            key={task.id}
            task={task}
            labels={resolveLabels(task.labelIds, labels)}
            onToggleDone={(t) =>
              onToggleDone({ id: t.id, done: t.status !== 'DONE', now: nowISO() })
            }
            onReorder={
              onReorder &&
              ((direction) => onReorder({ columnTasks: column.tasks, taskId: task.id, direction }))
            }
            onQuickEdit={onQuickEdit && ((patch) => onQuickEdit(task.id, patch))}
          />
        ))}
      </ul>
      <AddCard
        busy={false}
        onAdd={(title) => onAddTask({ sectionId: column.section.id, title, order: nextOrder })}
      />
    </section>
  );
}
