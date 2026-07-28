import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { TaskCard } from '../task/TaskCard';
import { AddCard } from './AddCard';
import { nowISO } from '../task/today';
import { resolveLabels } from '../labels/resolveLabels';
import type { Column } from './taskGrouping';
import type { LabelRecord } from '../../lib/dataClient';

/** One section in the List view: a collapsible header (name + count) over a
 * stacked list of task rows, with an inline add at the bottom. Same data +
 * mutations as a board column, laid out as a vertical list. */
export function ListSection({
  column,
  labels = [],
  defaultOpen = true,
  onAddTask,
  onToggleDone,
}: {
  column: Column;
  labels?: LabelRecord[];
  defaultOpen?: boolean;
  onAddTask: (input: { sectionId: string; title: string; order: number }) => void;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const nextOrder = column.tasks.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), -1) + 1;

  return (
    <section className="list-section" data-testid="list-section" aria-label={column.section.name}>
      <button
        type="button"
        className="list-section__head"
        data-testid="list-section-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <span className="list-section__name">{column.section.name}</span>
        <span className="list-section__count">{column.tasks.length}</span>
      </button>
      {open && (
        <>
          <ul className="list-section__rows">
            {column.tasks.map((task) => (
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
        </>
      )}
    </section>
  );
}
