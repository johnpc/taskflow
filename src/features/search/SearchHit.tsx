import { dueLabelWithTime } from '../task/taskMeta';
import { todayISO } from '../task/today';
import { projectColorVar } from '../projects/projectColors';
import type { ProjectRef } from '../projects/useProjectsById';
import type { TaskRecord } from '../../lib/dataClient';

/** One search result row: the task title over a meta line with its project chip
 * (colored dot + name) and a due-date label. Opening is delegated up. */
export function SearchHit({
  task,
  project,
  onOpen,
}: {
  task: TaskRecord;
  project?: ProjectRef;
  onOpen: () => void;
}) {
  const due = dueLabelWithTime(task.dueDate, task.dueTime, todayISO());
  return (
    <button type="button" className="search__hit" data-testid="search-hit" onClick={onOpen}>
      <span className="search__hit-title">{task.title}</span>
      <span className="search__hit-meta">
        {project && (
          <span className="task-card__project" data-testid="hit-project">
            <span
              className="task-card__project-dot"
              style={{ background: projectColorVar(project.color) }}
              aria-hidden="true"
            />
            {project.name}
          </span>
        )}
        {due && <span className="search__hit-due">{due}</span>}
      </span>
    </button>
  );
}
