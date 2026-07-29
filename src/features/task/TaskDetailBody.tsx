import { useHistory } from 'react-router-dom';
import { TaskHeader } from './TaskHeader';
import { TaskActivity } from './TaskActivity';
import { TaskFields } from './TaskFields';
import { TaskAssignment } from './TaskAssignment';
import { TaskLabels } from './TaskLabels';
import { TaskDependencies } from './TaskDependencies';
import { Subtasks } from './Subtasks';
import { Comments } from './Comments';
import { DeleteTaskButton } from './DeleteTaskButton';
import { nextSubtaskOrder } from './nextSubtaskOrder';
import { nowISO } from './today';
import { useTaskSections } from './useTaskSections';
import { useAuth } from '../auth/useAuth';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

/** The rendered body of a loaded task: header, fields, section+assignee,
 * labels, subtasks, comments. Split out of TaskDetail so the screen stays a
 * thin load-gate shell. All mutations come from the useTaskDetail hook. */
export function TaskDetailBody({ task, hook }: { task: TaskRecord; hook: TaskDetailHook }) {
  const { query, patch, toggleDone, addSubtask, comment, labels, remove } = hook;
  const sections = useTaskSections(task.projectId);
  const { email } = useAuth();
  const history = useHistory();
  const subtasks = query.data?.subtasks ?? [];

  const deleteTask = () =>
    remove.mutate(task.id, { onSuccess: () => history.replace(`/projects/${task.projectId}`) });

  return (
    <div className="task-detail" data-testid="task-detail">
      <TaskHeader
        task={task}
        onToggleDone={(done) => toggleDone.mutate({ taskId: task.id, done, now: nowISO() })}
        onRename={(title) => patch.mutate({ id: task.id, title })}
      />
      <TaskActivity task={task} nowMs={Date.now()} />
      <TaskFields task={task} onPatch={(p) => patch.mutate({ id: task.id, ...p })} />
      <TaskAssignment
        task={task}
        sections={sections.data ?? []}
        currentEmail={email}
        onMove={(sectionId) => patch.mutate({ id: task.id, sectionId })}
        onAssign={(assigneeEmail) => patch.mutate({ id: task.id, assigneeEmail })}
      />
      <TaskLabels
        task={task}
        registry={labels.query.data ?? []}
        onPatchLabels={(labelIds) => patch.mutate({ id: task.id, labelIds })}
        onCreateLabel={(input) => labels.create.mutate(input)}
      />
      <TaskDependencies
        task={task}
        onPatch={(blockedByIds) => patch.mutate({ id: task.id, blockedByIds })}
      />
      <Subtasks
        subtasks={subtasks}
        onAdd={(title) =>
          addSubtask.mutate({ projectId: task.projectId, title, order: nextSubtaskOrder(subtasks) })
        }
        onToggle={(input) => toggleDone.mutate(input)}
      />
      <Comments
        comments={query.data?.comments ?? []}
        busy={comment.isPending}
        onPost={(body) => comment.mutate(body)}
      />
      <DeleteTaskButton onDelete={deleteTask} />
    </div>
  );
}
