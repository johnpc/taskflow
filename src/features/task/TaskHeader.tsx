import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone } from './taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail header: the big complete toggle + an editable title. Editing
 * commits on blur / Enter; presentational + delegating. */
export function TaskHeader({
  task,
  onToggleDone,
  onRename,
}: {
  task: TaskRecord;
  onToggleDone: (done: boolean) => void;
  onRename: (title: string) => void;
}) {
  const done = isDone(task);
  const [title, setTitle] = useState(task.title);

  const commit = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) onRename(trimmed);
    else setTitle(task.title);
  };

  return (
    <header className="task-header">
      <button
        type="button"
        className={done ? 'task-header__check task-header__check--done' : 'task-header__check'}
        data-testid="task-detail-check"
        aria-pressed={done}
        aria-label={done ? 'Mark not done' : 'Mark done'}
        onClick={() => onToggleDone(!done)}
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
    </header>
  );
}
