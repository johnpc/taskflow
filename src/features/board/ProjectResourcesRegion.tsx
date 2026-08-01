import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward, linkOutline } from 'ionicons/icons';
import { KeyResources } from './KeyResources';
import { useProjectResources } from './useProjectResources';
import './keyResources.css';

/** Project overview "Key resources": a collapsible list of named links (spec,
 * doc, design) for the project, with an add form. Mirrors the custom-fields
 * manager's collapsible shell; data + mutations come from useProjectResources. */
export function ProjectResourcesRegion({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const { query, add, remove } = useProjectResources(projectId);
  const resources = query.data ?? [];

  return (
    <section className="key-resources" data-testid="key-resources">
      <button
        type="button"
        className="key-resources__head"
        data-testid="key-resources-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
        <IonIcon icon={linkOutline} aria-hidden="true" />
        <span>Key resources</span>
        <span className="key-resources__count">{resources.length}</span>
      </button>
      {open && (
        <KeyResources
          resources={resources}
          busy={add.isPending}
          onAdd={(input) => add.mutate(input)}
          onRemove={(id) => remove.mutate(id)}
        />
      )}
    </section>
  );
}
