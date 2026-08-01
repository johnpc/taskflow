import type { TaskRecord } from '../../lib/dataClient';
import type { SortKey } from './taskFilter';

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };

/** Order a column's tasks by the chosen board sort key (manual keeps the input
 * order). Pure + total. Split from taskFilter to keep that file focused on the
 * filter model + matching. */
export function sortColumn(tasks: TaskRecord[], sort: SortKey): TaskRecord[] {
  const out = [...tasks];
  if (sort === 'due') {
    out.sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  } else if (sort === 'priority') {
    const rank = (p?: string | null) => PRIORITY_RANK[p ?? 'NONE'] ?? 3;
    out.sort((a, b) => rank(a.priority) - rank(b.priority));
  }
  return out;
}
