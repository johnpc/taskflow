import { RepeatPicker } from './RepeatPicker';
import { MilestoneToggle } from './MilestoneToggle';
import { TaskColorPicker } from './TaskColorPicker';
import { ProjectPicker } from './ProjectPicker';
import { TaskAssignment } from './TaskAssignment';
import type { ProjectRecord, SectionRecord, TaskRecord } from '../../lib/dataClient';

/** The task-detail settings cluster: recurrence, milestone flag, project +
 * section move, and assignee. Grouped so TaskDetailBody stays a thin composer.
 * All changes are delegated up via the single onPatch / onMoveProject. */
export function TaskSettings({
  task,
  sections,
  projects,
  currentEmail,
  onPatch,
  onMoveProject,
}: {
  task: TaskRecord;
  sections: SectionRecord[];
  projects: ProjectRecord[];
  currentEmail: string | null;
  onPatch: (patch: Partial<TaskRecord>) => void;
  onMoveProject: (projectId: string) => void;
}) {
  return (
    <>
      <RepeatPicker task={task} onChange={(repeat) => onPatch({ repeat })} />
      <MilestoneToggle task={task} onToggle={(isMilestone) => onPatch({ isMilestone })} />
      <TaskColorPicker task={task} onChange={(color) => onPatch({ color })} />
      <ProjectPicker task={task} projects={projects} onMove={onMoveProject} />
      <TaskAssignment
        task={task}
        sections={sections}
        currentEmail={currentEmail}
        onMove={(sectionId) => onPatch({ sectionId })}
        onAssign={(assigneeEmail) => onPatch({ assigneeEmail })}
      />
    </>
  );
}
