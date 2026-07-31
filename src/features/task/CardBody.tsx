import { useHistory } from 'react-router-dom';
import { CardTitle } from './CardTitle';
import { CardMeta } from './CardMeta';
import { CardCover } from './CardCover';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

/** A task card's body: the (optionally-renamable) title that opens the task,
 * plus its meta row (project/blocked/due/priority/subtasks/labels). Split from
 * TaskCard to keep that component within the line limit. */
export function CardBody({
  task,
  labels,
  blocked,
  subtasks,
  project,
  onRename,
}: {
  task: TaskRecord;
  labels: LabelRecord[];
  blocked?: boolean;
  subtasks?: { done: number; total: number };
  project?: { name: string; color: string | null };
  onRename?: (title: string) => void;
}) {
  const history = useHistory();
  return (
    <div className="task-card__body">
      <CardCover task={task} />
      <CardTitle
        title={task.title}
        onOpen={() => history.push(`/tasks/${task.id}`)}
        onRename={onRename}
      />
      <CardMeta
        task={task}
        labels={labels}
        blocked={blocked}
        subtasks={subtasks}
        project={project}
      />
    </div>
  );
}
