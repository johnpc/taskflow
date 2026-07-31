import { IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

/** A "‹ Project name" breadcrumb above a top-level task's header, linking to its
 * project board — orientation when a task is opened via a deep link. Renders
 * nothing without a resolved name (or for a subtask, which shows its parent
 * breadcrumb instead). */
export function ProjectCrumb({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string | undefined;
}) {
  const history = useHistory();
  if (!projectName) return null;
  return (
    <button
      type="button"
      className="task-breadcrumb"
      data-testid="task-project-crumb"
      onClick={() => history.push(`/projects/${projectId}`)}
    >
      <IonIcon icon={chevronBackOutline} aria-hidden="true" />
      <span>{projectName}</span>
    </button>
  );
}
