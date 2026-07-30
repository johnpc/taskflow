import { ProjectMembers } from './ProjectMembers';
import { useProjectMembers } from './useProjectMembers';

/** Wires the project's member list to the sharing UI (add/remove + cascade).
 * Renders nothing until the project's members have loaded. Split from
 * ProjectView so that screen stays a thin composer under the line limit. */
export function ProjectShareRegion({
  projectId,
  members,
}: {
  projectId: string;
  members: string[];
}) {
  const ctrl = useProjectMembers(projectId, members);
  if (members.length === 0) return null;
  return (
    <ProjectMembers members={members} busy={ctrl.busy} onAdd={ctrl.add} onRemove={ctrl.remove} />
  );
}
