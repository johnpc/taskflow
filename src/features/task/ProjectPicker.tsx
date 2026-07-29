import type { ProjectRecord, TaskRecord } from '../../lib/dataClient';

/** Task-detail "Project" picker: move the task to another of the owner's
 * projects. Selecting a different project delegates the move up (which relands
 * it in that project's first section). Renders only. */
export function ProjectPicker({
  task,
  projects,
  onMove,
}: {
  task: TaskRecord;
  projects: ProjectRecord[];
  onMove: (projectId: string) => void;
}) {
  return (
    <label className="task-fields__row" data-testid="task-project-row">
      <span className="task-fields__label">Project</span>
      <select
        className="task-assign__select"
        data-testid="task-project-select"
        value={task.projectId ?? ''}
        onChange={(e) => e.target.value !== task.projectId && onMove(e.target.value)}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
