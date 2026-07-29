import { useHistory } from 'react-router-dom';
import { TaskHeader } from './TaskHeader';
import { TaskActivity } from './TaskActivity';
import { TaskFields } from './TaskFields';
import { TaskSettings } from './TaskSettings';
import { TaskLabels } from './TaskLabels';
import { TaskDependencies } from './TaskDependencies';
import { Subtasks } from './Subtasks';
import { Comments } from './Comments';
import { Attachments } from './Attachments';
import { TaskActions } from './TaskActions';
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
  const { query, patch, toggleDone, addSubtask, comments, labels } = hook;
  const { remove, duplicate, attachments, projects, move } = hook;
  const sections = useTaskSections(task.projectId);
  const { email } = useAuth();
  const history = useHistory();
  const subtasks = query.data?.subtasks ?? [];

  const deleteTask = () =>
    remove.mutate(task.id, { onSuccess: () => history.replace(`/projects/${task.projectId}`) });

  const duplicateTask = () =>
    duplicate.mutate(task, { onSuccess: (copy) => history.push(`/tasks/${copy.id}`) });

  return (
    <div className="task-detail" data-testid="task-detail">
      <TaskHeader
        task={task}
        onToggleDone={(done) => toggleDone.mutate({ taskId: task.id, done, now: nowISO() })}
        onRename={(title) => patch.mutate({ id: task.id, title })}
      />
      <TaskActivity task={task} nowMs={Date.now()} />
      <TaskFields task={task} onPatch={(p) => patch.mutate({ id: task.id, ...p })} />
      <TaskSettings
        task={task}
        sections={sections.data ?? []}
        projects={projects.data ?? []}
        currentEmail={email}
        onPatch={(p) => patch.mutate({ id: task.id, ...p })}
        onMoveProject={(projectId) => move.mutate({ taskId: task.id, projectId })}
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
      <Attachments
        attachments={query.data?.attachments ?? []}
        busy={attachments.add.isPending}
        onAdd={(input) => attachments.add.mutate(input)}
        onRemove={(id) => attachments.remove.mutate(id)}
      />
      <Comments
        comments={query.data?.comments ?? []}
        busy={comments.add.isPending}
        onPost={(body) => comments.add.mutate(body)}
        onEdit={(input) => comments.edit.mutate(input)}
        onDelete={(id) => comments.remove.mutate(id)}
      />
      <TaskActions
        duplicating={duplicate.isPending}
        onDuplicate={duplicateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
