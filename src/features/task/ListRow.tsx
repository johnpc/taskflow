import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { isDone, type Priority } from './taskMeta';
import { CardTitle } from './CardTitle';
import { ListRowChips } from './ListRowChips';
import { ListRowCells } from './ListRowCells';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** One task as an aligned List-view row: complete toggle + Task (title + chips)
 * | Assignee | Due | Priority, matching the ListHeaderRow columns. The Due and
 * Priority cells are inline editors (quick-edit). Keeps the `task-card` testid
 * so board/list e2e that locates rows by it still works. */
export function ListRow({
  task,
  labels = [],
  blocked,
  subtasks,
  onToggleDone,
  onQuickEdit,
  selected,
  onSelect,
}: {
  task: TaskRecord;
  labels?: LabelRecord[];
  blocked?: boolean;
  subtasks?: { done: number; total: number };
  onToggleDone: (task: TaskRecord) => void;
  onQuickEdit?: (patch: { dueDate?: string | null; priority?: Priority; title?: string }) => void;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const history = useHistory();
  const done = isDone(task);
  return (
    <li
      className={done ? 'list-row task-card task-card--done' : 'list-row task-card'}
      data-testid="task-card"
      data-selected={selected ? 'true' : undefined}
    >
      <span className="list-row__lead">
        {onSelect && (
          <input
            type="checkbox"
            className="task-card__select"
            data-testid="task-select"
            aria-label={`Select ${task.title}`}
            checked={!!selected}
            onChange={onSelect}
          />
        )}
        <button
          type="button"
          className="task-card__check"
          data-testid="task-check"
          aria-pressed={done}
          aria-label={done ? `Mark ${task.title} not done` : `Complete ${task.title}`}
          onClick={() => onToggleDone(task)}
        >
          <IonIcon icon={done ? checkmarkCircle : ellipseOutline} />
        </button>
      </span>
      <span className="list-row__task">
        <CardTitle
          title={task.title}
          onOpen={() => history.push(`/tasks/${task.id}`)}
          onRename={onQuickEdit && ((title) => onQuickEdit({ title }))}
        />
        <ListRowChips task={task} labels={labels} blocked={blocked} subtasks={subtasks} />
      </span>
      <ListRowCells task={task} onQuickEdit={onQuickEdit} />
    </li>
  );
}
