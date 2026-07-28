import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import { star, starOutline, chevronForward } from 'ionicons/icons';
import { projectColorVar } from './projectColors';
import type { ProjectRecord } from '../../lib/dataClient';
import './projects.css';

/** A single project row on the Projects screen — accent dot, name, and a
 * favorite toggle. Renders only; the toggle is handled by the parent. */
export function ProjectCard({
  project,
  onToggleFavorite,
}: {
  project: ProjectRecord;
  onToggleFavorite: (project: ProjectRecord) => void;
}) {
  const fav = !!project.favorite;
  return (
    <li className="project-card" data-testid="project-card">
      <Link className="project-card__main" to={`/projects/${project.id}`}>
        <span
          className="project-card__dot"
          style={{ background: projectColorVar(project.color) }}
          aria-hidden="true"
        />
        <span className="project-card__name">{project.name}</span>
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
    </li>
  );
}
