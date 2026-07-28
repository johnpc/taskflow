import { TaskHeader } from './TaskHeader';
import { TaskFields } from './TaskFields';
import { TaskAssignment } from './TaskAssignment';
import { TaskLabels } from './TaskLabels';
import { Subtasks } from './Subtasks';
import { Comments } from './Comments';
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
  const { query, patch, toggleDone, addSubtask, comment, labels } = hook;
  const sections = useTaskSections(task.projectId);
  const { email } = useAuth();
  const subtasks = query.data?.subtasks ?? [];

  return (
    <div className="task-detail" data-testid="task-detail">
      <TaskHeader
        task={task}
        onToggleDone={(done) => toggleDone.mutate({ taskId: task.id, done, now: nowISO() })}
        onRename={(title) => patch.mutate({ id: task.id, title })}
      />
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
    </div>
  );
}
