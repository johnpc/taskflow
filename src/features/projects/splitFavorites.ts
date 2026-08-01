import type { ProjectRecord } from '../../lib/dataClient';

/** Split projects into starred vs the rest, preserving the incoming order
 * within each group (the list is already favorites-first + sortOrder). Pure —
 * lets the Projects tab show a "Starred" section above "All projects" (Asana). */
export function splitFavorites(projects: ProjectRecord[]): {
  starred: ProjectRecord[];
  rest: ProjectRecord[];
} {
  const starred: ProjectRecord[] = [];
  const rest: ProjectRecord[] = [];
  for (const p of projects) (p.favorite ? starred : rest).push(p);
  return { starred, rest };
}
