import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import { star, starOutline, chevronForward } from 'ionicons/icons';
import { projectColorVar } from './projectColors';
import { StatusPill } from './StatusPill';
import { progressPercent, type Progress } from './taskCounts';
import type { ProjectRecord } from '../../lib/dataClient';
import './projects.css';

/** A single project row on the Projects screen — accent dot, name, favorite
 * toggle, and a completion progress bar. Renders only; the toggle is handled
 * by the parent. */
export function ProjectCard({
  project,
  count = 0,
  progress,
  onToggleFavorite,
}: {
  project: ProjectRecord;
  count?: number;
  progress?: Progress;
  onToggleFavorite: (project: ProjectRecord) => void;
}) {
  const fav = !!project.favorite;
  const total = progress?.total ?? 0;
  const pct = progress ? progressPercent(progress) : 0;
  return (
    <li className="project-card" data-testid="project-card">
      <Link className="project-card__main" to={`/projects/${project.id}`}>
        <span
          className="project-card__dot"
          style={{ background: projectColorVar(project.color) }}
          aria-hidden="true"
        />
        <span className="project-card__name" data-testid="project-name">
          {project.name}
        </span>
        <StatusPill status={project.status} />
        {count > 0 && (
          <span className="project-card__count" data-testid="project-count">
            {count}
          </span>
        )}
        <IonIcon className="project-card__chevron" icon={chevronForward} aria-hidden="true" />
      </Link>
      <button
        type="button"
        className="project-card__fav"
        data-testid="project-fav"
        aria-pressed={fav}
        aria-label={fav ? `Unfavorite ${project.name}` : `Favorite ${project.name}`}
        onClick={() => onToggleFavorite(project)}
      >
        <IonIcon icon={fav ? star : starOutline} />
      </button>
      {/* Always render the progress region so every project row is the SAME
          height — an empty project shows an empty bar + "No tasks yet" instead
          of collapsing to a shorter row, which made the list rhythm jagged. */}
      <div className="project-card__progress" data-testid="project-progress">
        <div className="project-card__bar" role="progressbar" aria-valuenow={pct}>
          <span className="project-card__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="project-card__progress-label" data-testid="project-progress-label">
          {total > 0 ? `${progress!.done} of ${total} done` : 'No tasks yet'}
        </span>
      </div>
    </li>
  );
}
