import { useState } from 'react';
import { readCollapsed, writeCollapsed } from './sectionCollapse';

/** Open/collapsed state for a List-view section, seeded from + persisted to
 * localStorage (keyed by section id). `defaultOpen` is used only when the
 * section has no stored preference yet. */
export function useSectionCollapse(sectionId: string, defaultOpen: boolean) {
  const [open, setOpen] = useState(() => !readCollapsed(sectionId, !defaultOpen));

  const toggle = () =>
    setOpen((prev) => {
      const next = !prev;
      writeCollapsed(sectionId, !next);
      return next;
    });

  return { open, toggle };
}
