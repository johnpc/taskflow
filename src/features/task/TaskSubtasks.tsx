import { Subtasks } from './Subtasks';
import { assigneeOptions } from './assigneeOptions';
import { nextSubtaskOrder } from './nextSubtaskOrder';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

/** Wires the subtask checklist to the detail hook: add (parented + ordered),
 * complete-toggle, open, and inline due/assignee edits. Split from
 * TaskDetailBody so that composer stays within the line limit. */
export function TaskSubtasks({
  task,
  hook,
  currentEmail,
  onOpen,
}: {
  task: TaskRecord;
  hook: TaskDetailHook;
  currentEmail: string | null;
  onOpen: (id: string) => void;
}) {
  const { query, patch, toggleDone, addSubtask } = hook;
  const subtasks = query.data?.subtasks ?? [];
  return (
    <Subtasks
      subtasks={subtasks}
      members={assigneeOptions(task.members, currentEmail)}
      onAdd={(title) =>
        addSubtask.mutate({ projectId: task.projectId, title, order: nextSubtaskOrder(subtasks) })
      }
      onToggle={(input) => toggleDone.mutate(input)}
      onOpen={onOpen}
      onSetDue={(id, dueDate) => patch.mutate({ id, dueDate })}
      onAssign={(id, assigneeEmail) => patch.mutate({ id, assigneeEmail })}
    />
  );
}
