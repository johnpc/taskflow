import { TaskCard } from '../task/TaskCard';
import { AddCard } from './AddCard';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { Column } from './taskGrouping';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** One board column: a section header, its task cards, and an inline add-card
 * composer. New cards append after the current highest sortOrder. Renders +
 * delegates the two mutations up to the board hook. */
export function BoardColumn({
  column,
  labels = [],
  onAddTask,
  onToggleDone,
}: {
  column: Column;
  labels?: LabelRecord[];
  onAddTask: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
}) {
  const nextOrder = column.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;
  return (
    <section className="board-col" data-testid="board-column" aria-label={column.section.name}>
      <header className="board-col__head">
        <span className="board-col__name">{column.section.name}</span>
        <span className="board-col__count">{column.tasks.length}</span>
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
