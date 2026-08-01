import { useSyncExternalStore } from 'react';
import { readCollapsed, writeCollapsed, subscribeCollapse } from './sectionCollapse';

/** Open/collapsed state for a board/list section, read from + persisted to the
 * reactive collapse store (keyed by section id). Subscribes so a "collapse all"
 * action updates this section live. `defaultOpen` is used only when the section
 * has no stored preference yet. */
export function useSectionCollapse(sectionId: string, defaultOpen: boolean) {
  const open = useSyncExternalStore(
    subscribeCollapse,
    () => !readCollapsed(sectionId, !defaultOpen),
  );

  const toggle = () => writeCollapsed(sectionId, open);

  return { open, toggle };
}
