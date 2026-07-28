import type { ProjectRecord } from '../../lib/dataClient';

/** Order projects for the list: favorites first, then by sortOrder, then name.
 * Pure + total (stable for equal keys) so the list read is deterministic and
 * unit-testable. */
export function sortProjects(projects: ProjectRecord[]): ProjectRecord[] {
  return [...projects].sort((a, b) => {
    const favDelta = Number(!!b.favorite) - Number(!!a.favorite);
    if (favDelta !== 0) return favDelta;
    const orderDelta = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDelta !== 0) return orderDelta;
    return (a.name ?? '').localeCompare(b.name ?? '');
  });
}
