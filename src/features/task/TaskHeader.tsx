import { useState } from 'react';
import { IonAlert, IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone } from './taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail header: the big complete toggle + an editable title. Editing
 * commits on blur / Enter; presentational + delegating. Completing a task that
 * isn't ready (open dependencies or subtasks) first asks for confirmation with
 * the supplied `warning` message (Asana parity). */
export function TaskHeader({
  task,
  warning = null,
  onToggleDone,
  onRename,
}: {
  task: TaskRecord;
  warning?: string | null;
  onToggleDone: (done: boolean) => void;
  onRename: (title: string) => void;
}) {
  const done = isDone(task);
  const [title, setTitle] = useState(task.title);
  const [confirm, setConfirm] = useState(false);

  const commit = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) onRename(trimmed);
    else setTitle(task.title);
  };

  const toggle = () => {
    if (!done && warning) setConfirm(true);
    else onToggleDone(!done);
  };

  return (
    <header className="task-header">
      <button
        type="button"
        className={done ? 'task-header__check task-header__check--done' : 'task-header__check'}
        data-testid="task-detail-check"
        aria-pressed={done}
        aria-label={done ? 'Mark not done' : 'Mark done'}
        onClick={toggle}
      >
        <IonIcon icon={done ? checkmarkCircle : ellipseOutline} />
      </button>
      <input
        className={done ? 'task-header__title task-header__title--done' : 'task-header__title'}
        data-testid="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <IonAlert
        isOpen={confirm}
        header="This task isn't ready"
        message={warning ?? ''}
        data-testid="blocked-confirm"
        onDidDismiss={() => setConfirm(false)}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Complete anyway',
            htmlAttributes: { 'data-testid': 'blocked-confirm-yes' },
            handler: () => onToggleDone(true),
          },
        ]}
      />
    </header>
  );
}
