import { ParentBreadcrumb } from './ParentBreadcrumb';
import { TaskHeader } from './TaskHeader';
import { TaskActivity } from './TaskActivity';
import { TaskFields } from './TaskFields';
import { TaskSettings } from './TaskSettings';
import { TaskLabels } from './TaskLabels';
import { TaskDependencies } from './TaskDependencies';
import { Subtasks } from './Subtasks';
import { TaskDetailExtras } from './TaskDetailExtras';
import { TaskActions } from './TaskActions';
import { nextSubtaskOrder } from './nextSubtaskOrder';
import { nowISO } from './today';
import { completeWarning } from './completeWarning';
import { useTaskBlocked } from './useTaskBlocked';
import { useTaskDetailNav } from './useTaskDetailNav';
import { useTaskSections } from './useTaskSections';
import { useAuth } from '../auth/useAuth';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

/** The rendered body of a loaded task: header, fields, section+assignee,
 * labels, subtasks, comments. Split out of TaskDetail so the screen stays a
 * thin load-gate shell. All mutations come from the useTaskDetail hook. */
export function TaskDetailBody({ task, hook }: { task: TaskRecord; hook: TaskDetailHook }) {
  const { query, patch, toggleDone, addSubtask, labels } = hook;
  const { projects, move, duplicate, promote } = hook;
  const sections = useTaskSections(task.projectId);
  const blocked = useTaskBlocked(task);
  const { email } = useAuth();
  const { deleteTask, duplicateTask, openTask } = useTaskDetailNav(task, hook);
  const subtasks = query.data?.subtasks ?? [];
  const warning = completeWarning(blocked, subtasks);

  return (
    <div className="task-detail" data-testid="task-detail">
      <ParentBreadcrumb
        parentTaskId={task.parentTaskId}
        onOpen={openTask}
        onPromote={() => promote.mutate(task)}
      />
      <TaskHeader
        task={task}
        warning={warning}
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
        onOpen={openTask}
      />
      <TaskDetailExtras task={task} hook={hook} />
      <TaskActions
        taskId={task.id}
        duplicating={duplicate.isPending}
        onDuplicate={duplicateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
