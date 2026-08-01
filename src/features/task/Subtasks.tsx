import { IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { AddCard } from '../board/AddCard';
import { SubtaskDue } from './SubtaskDue';
import { SubtaskAssignee } from './SubtaskAssignee';
import { isDone } from './taskMeta';
import { nowISO, todayISO } from './today';
import type { TaskRecord } from '../../lib/dataClient';

/** Subtask checklist on task detail: each child task with a complete toggle,
 * plus an inline add. Delegates all mutations to the parent hook. */
export function Subtasks({
  subtasks,
  members,
  onAdd,
  onToggle,
  onOpen,
  onSetDue,
  onAssign,
}: {
  subtasks: TaskRecord[];
  members?: string[];
  onAdd: (title: string) => void;
  onToggle: (input: { taskId: string; done: boolean; now: string }) => void;
  onOpen: (id: string) => void;
  onSetDue?: (id: string, dueDate: string | null) => void;
  onAssign?: (id: string, email: string | null) => void;
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
              <SubtaskDue
                dueDate={sub.dueDate}
                done={done}
                today={today}
                onSetDue={onSetDue && ((d) => onSetDue(sub.id, d))}
              />
              <SubtaskAssignee
                assigneeEmail={sub.assigneeEmail}
                members={members}
                onAssign={onAssign && ((email) => onAssign(sub.id, email))}
              />
            </li>
          );
        })}
      </ul>
      <AddCard busy={false} onAdd={onAdd} />
    </section>
  );
}
