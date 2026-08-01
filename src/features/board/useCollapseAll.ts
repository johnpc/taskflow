import { useSyncExternalStore } from 'react';
import { areAllCollapsed, setManyCollapsed, subscribeCollapse } from './sectionCollapse';

/** Drives a "collapse all / expand all" toggle over a set of section ids,
 * reading + writing the shared reactive collapse store. `allCollapsed` reflects
 * whether every section is currently collapsed; `toggleAll` flips them all. */
export function useCollapseAll(sectionIds: string[], defaultOpen = true) {
  const allCollapsed = useSyncExternalStore(subscribeCollapse, () =>
    areAllCollapsed(sectionIds, defaultOpen),
  );

  const toggleAll = () => setManyCollapsed(sectionIds, !allCollapsed);

  return { allCollapsed, toggleAll };
}
