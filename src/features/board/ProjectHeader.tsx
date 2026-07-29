import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { addOutline, checkmarkDoneOutline } from 'ionicons/icons';
import type { ProjectRecord } from '../../lib/dataClient';
import './board.css';

/** Project overview header: an editable one-line description and an inline
 * "add section" composer. Presentational + local draft state; the description
 * commits on blur and the section name on Enter, both delegated up. */
export function ProjectHeader({
  project,
  onDescribe,
  onAddSection,
}: {
  project: ProjectRecord;
  onDescribe: (description: string) => void;
  onAddSection: (name: string) => void;
}) {
  const [section, setSection] = useState('');
  const submitSection = () => {
    const name = section.trim();
    if (!name) return;
    onAddSection(name);
    setSection('');
  };

  return (
    <div className="project-header" data-testid="project-header">
      <input
        className="project-header__desc"
        data-testid="project-description"
        placeholder="Add a project description…"
        defaultValue={project.description ?? ''}
        onBlur={(e) => e.target.value !== (project.description ?? '') && onDescribe(e.target.value)}
      />
      <div className="project-header__row">
        <div className="project-header__add-section">
          <IonIcon icon={addOutline} aria-hidden="true" />
          <input
            className="project-header__section-input"
            data-testid="add-section-input"
            placeholder="Add section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSection()}
          />
        </div>
        <Link
          className="project-header__completed"
          data-testid="completed-link"
          to={`/projects/${project.id}/completed`}
        >
          <IonIcon icon={checkmarkDoneOutline} aria-hidden="true" />
          <span>Completed</span>
        </Link>
      </div>
    </div>
  );
}
