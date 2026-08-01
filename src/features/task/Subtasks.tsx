import { IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { AddCard } from '../board/AddCard';
import { isDone, dueLabel, dueStatus } from './taskMeta';
import { nowISO, todayISO } from './today';
import type { TaskRecord } from '../../lib/dataClient';

/** Subtask checklist on task detail: each child task with a complete toggle,
 * plus an inline add. Delegates all mutations to the parent hook. */
export function Subtasks({
  subtasks,
  onAdd,
  onToggle,
  onOpen,
}: {
  subtasks: TaskRecord[];
  onAdd: (title: string) => void;
  onToggle: (input: { taskId: string; done: boolean; now: string }) => void;
  onOpen: (id: string) => void;
}) {
  const doneCount = subtasks.filter(isDone).length;
  const today = todayISO();
  return (
    <section className="subtasks" data-testid="subtasks">
      <h2 className="subtasks__head">
        Subtasks
        {subtasks.length > 0 && (
          <span className="subtasks__count" data-testid="subtasks-count">
            {doneCount}/{subtasks.length}
          </span>
        )}
      </h2>
      <ul className="subtasks__list">
        {subtasks.map((sub) => {
          const done = isDone(sub);
          return (
            <li key={sub.id} className={done ? 'subtask subtask--done' : 'subtask'}>
              <button
                type="button"
                className="subtask__check"
                data-testid="subtask-check"
                aria-pressed={done}
                aria-label={done ? `Reopen ${sub.title}` : `Complete ${sub.title}`}
                onClick={() => onToggle({ taskId: sub.id, done: !done, now: nowISO() })}
              >
                <IonIcon icon={done ? checkmarkCircle : ellipseOutline} />
              </button>
              <button
                type="button"
                className="subtask__title"
                data-testid="subtask-open"
                onClick={() => onOpen(sub.id)}
              >
                {sub.title}
              </button>
              {sub.dueDate && (
                <span
                  className={`subtask__due subtask__due--${dueStatus(sub.dueDate, today, done)}`}
                  data-testid="subtask-due"
                >
                  {dueLabel(sub.dueDate, today)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <AddCard busy={false} onAdd={onAdd} />
    </section>
  );
}
