import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { useArchivedProjects, useUnarchiveProject } from './useArchivedProjects';
import { projectColorVar } from './projectColors';

/** Collapsible "Archived" section at the bottom of the Projects screen: lists
 * the owner's archived projects, each with a Restore button. Hidden entirely
 * when there are none. Owns its own fetch + restore mutation. */
export function ArchivedSection() {
  const [open, setOpen] = useState(false);
  const { data } = useArchivedProjects();
  const restore = useUnarchiveProject();
  const archived = data ?? [];
  if (archived.length === 0) return null;

  return (
    <section className="archived" data-testid="archived-section">
      <button
        type="button"
        className="archived__head"
        data-testid="archived-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <span>Archived</span>
        <span className="archived__count">{archived.length}</span>
      </button>
      {open && (
        <ul className="archived__list">
          {archived.map((project) => (
            <li key={project.id} className="archived__row" data-testid="archived-project">
              <span
                className="project-card__dot"
                style={{ background: projectColorVar(project.color) }}
                aria-hidden="true"
              />
              <span className="archived__name">{project.name}</span>
              <button
                type="button"
                className="archived__restore"
                data-testid="archived-restore"
                aria-label={`Restore ${project.name}`}
                onClick={() => restore.mutate(project.id)}
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
