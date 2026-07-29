import { projectColorVar } from '../projects/projectColors';
import type { ProjectRef } from '../projects/useProjectsById';

/** One calendar day-row entry: the task title with its project chip (colored dot
 * + name) so a cross-project day view tells you which project each task is in,
 * consistent with My Tasks and Search. Opening is delegated up. */
export function CalendarTask({
  title,
  project,
  onOpen,
}: {
  title: string;
  project?: ProjectRef;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="calendar__task" data-testid="calendar-task" onClick={onOpen}>
      <span className="calendar__task-title">{title}</span>
      {project && (
        <span className="task-card__project" data-testid="calendar-project">
          <span
            className="task-card__project-dot"
            style={{ background: projectColorVar(project.color) }}
            aria-hidden="true"
          />
          {project.name}
        </span>
      )}
    </button>
  );
}
