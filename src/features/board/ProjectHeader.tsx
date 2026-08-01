import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { addOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { StatusPill } from '../projects/StatusPill';
import { StatusPicker } from '../projects/StatusPicker';
import { ProjectColorPicker } from '../projects/ProjectColorPicker';
import type { ProjectStatus } from '../projects/projectStatus';
import type { ProjectRecord } from '../../lib/dataClient';
import './board.css';

/** Project overview header: a health status pill + picker, a color picker, an
 * editable multi-line description, and an inline "add section" composer.
 * Presentational + local draft state; edits commit on blur/Enter, delegated up. */
export function ProjectHeader({
  project,
  onDescribe,
  onSetStatus,
  onSetColor,
  onAddSection,
}: {
  project: ProjectRecord;
  onDescribe: (description: string) => void;
  onSetStatus: (next: { status: ProjectStatus | null; statusNote?: string }) => void;
  onSetColor: (color: string) => void;
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
      <div className="project-header__status">
        <StatusPill status={project.status} />
        <StatusPicker status={project.status} note={project.statusNote} onChange={onSetStatus} />
      </div>
      <ProjectColorPicker color={project.color} onPick={onSetColor} />
      {project.status && project.statusNote && (
        <p className="project-header__status-note" data-testid="status-note-text">
          {project.statusNote}
        </p>
      )}
      <textarea
        className="project-header__desc"
        data-testid="project-description"
        placeholder="Add a project description…"
        rows={2}
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
