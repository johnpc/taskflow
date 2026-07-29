import { relativeTime } from './relativeTime';
import type { TaskRecord } from '../../lib/dataClient';
import './taskDetail.css';

/** A subtle activity line on task detail: when the task was created and (if
 * done) completed, as relative times. `nowMs` is injected for determinism. */
export function TaskActivity({ task, nowMs }: { task: TaskRecord; nowMs: number }) {
  const created = relativeTime(task.createdAt, nowMs);
  const completed = task.completedAt ? relativeTime(task.completedAt, nowMs) : '';
  if (!created && !completed) return null;
  return (
    <p className="task-activity" data-testid="task-activity">
      {created && <span data-testid="activity-created">Created {created}</span>}
      {completed && <span data-testid="activity-completed"> · Completed {completed}</span>}
    </p>
  );
}
