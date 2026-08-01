import { ProjectHeader } from './ProjectHeader';
import { ProjectShareRegion } from './ProjectShareRegion';
import { StatusUpdatesRegion } from './StatusUpdatesRegion';
import { ProjectResourcesRegion } from './ProjectResourcesRegion';
import { ProjectFieldsRegion } from '../customfields/ProjectFieldsRegion';
import type { useProjectEdit } from './useProjectEdit';
import type { ProjectRecord } from '../../lib/dataClient';

/** The stacked project-overview regions above the board: the header (status /
 * color / description / add-section), sharing, status-update history, and the
 * custom-field manager. Split from ProjectView to keep that shell within the
 * line limit. Renders only. */
export function ProjectHeaderRegion({
  id,
  project,
  members,
  edit,
  onAddSection,
}: {
  id: string;
  project?: ProjectRecord;
  members: string[];
  edit: ReturnType<typeof useProjectEdit>;
  onAddSection: (name: string) => void;
}) {
  return (
    <>
      <h2 className="project-overview-head" data-testid="project-overview-head">
        Project details
      </h2>
      {project && (
        <ProjectHeader
          project={project}
          onDescribe={(description) => edit.mutate({ id, description })}
          onSetStatus={(next) => edit.mutate({ id, ...next })}
          onSetColor={(color) => edit.mutate({ id, color })}
          onAddSection={onAddSection}
        />
      )}
      <ProjectShareRegion projectId={id} members={members} />
      <StatusUpdatesRegion projectId={id} />
      <ProjectResourcesRegion projectId={id} />
      <ProjectFieldsRegion projectId={id} />
    </>
  );
}
