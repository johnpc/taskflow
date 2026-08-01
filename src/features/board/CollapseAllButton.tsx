import { IonIcon } from '@ionic/react';
import { contractOutline, expandOutline } from 'ionicons/icons';
import { useCollapseAll } from './useCollapseAll';

/** A single toolbar toggle that collapses or expands every board/list section
 * at once (Asana's board "collapse all"). Reads the shared collapse store, so
 * its label reflects the current state; hidden when there are no sections. */
export function CollapseAllButton({ sectionIds }: { sectionIds: string[] }) {
  const { allCollapsed, toggleAll } = useCollapseAll(sectionIds);
  if (sectionIds.length === 0) return null;
  const label = allCollapsed ? 'Expand all' : 'Collapse all';
  return (
    <button
      type="button"
      className="collapse-all"
      data-testid="collapse-all"
      aria-pressed={allCollapsed}
      onClick={toggleAll}
    >
      <IonIcon icon={allCollapsed ? expandOutline : contractOutline} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
