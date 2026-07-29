import { BlockerPicker } from './BlockerPicker';
import { useProjectTasks } from './useProjectTasks';
import { toggleBlockerId, blockerTasks, isBlocked, dependentTasks } from './dependencies';
import { isDone } from './taskMeta';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail dependencies section: a "Blocked" banner naming the open
 * blockers, plus a picker to add/remove same-project blockers. Toggling patches
 * the task's blockedByIds. Fetches the project's tasks itself to stay thin. */
export function TaskDependencies({
  task,
  onPatch,
}: {
  task: TaskRecord;
  onPatch: (blockedByIds: string[]) => void;
}) {
  const projectTasks = useProjectTasks(task.projectId);
  const all = projectTasks.data ?? [];
  const open = blockerTasks(task, all).filter((b) => !isDone(b));
  const dependents = dependentTasks(task, all);
  return (
    <section className="task-deps" data-testid="task-deps">
      <h2 className="subtasks__head">Blocked by</h2>
      {isBlocked(task, all) && (
        <p className="deps__banner" data-testid="blocked-banner">
          Blocked by {open.map((b) => b.title).join(', ')}
        </p>
      )}
      {dependents.length > 0 && (
        <p className="deps__blocking" data-testid="blocking-line">
          Blocking {dependents.map((d) => d.title).join(', ')}
        </p>
      )}
      <BlockerPicker
        task={task}
        candidates={all}
        onToggle={(id) => onPatch(toggleBlockerId(task.blockedByIds, id))}
      />
    </section>
  );
}
