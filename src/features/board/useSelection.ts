import { useCallback, useState } from 'react';

/** Multi-select state: a set of task ids with toggle / clear. Enabled implicitly
 * once anything is selected. Kept tiny + framework-only so the bulk-action bar
 * and list rows share one source of truth. */
export function useSelection() {
  const [ids, setIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);

  return { ids, toggle, clear, count: ids.size, active: ids.size > 0 };
}
