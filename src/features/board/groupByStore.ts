import type { GroupBy } from './listGrouping';

/** Per-project List-view group-by preference, persisted in localStorage keyed
 * by project id. Defaults to SECTION (the model's own columns). Pure helpers so
 * the hook stays thin and testable. */
const key = (projectId: string) => `tf-groupby-${projectId}`;

const VALID: GroupBy[] = ['NONE', 'SECTION', 'ASSIGNEE', 'DUE', 'PRIORITY'];

/** Read the stored group-by for a project, defaulting to SECTION. */
export function readGroupBy(projectId: string): GroupBy {
  try {
    const raw = localStorage.getItem(key(projectId));
    if (raw && (VALID as string[]).includes(raw)) return raw as GroupBy;
  } catch {
    /* storage unavailable — use the default */
  }
  return 'SECTION';
}

/** Persist a project's chosen group-by (best-effort). */
export function writeGroupBy(projectId: string, by: GroupBy): void {
  try {
    localStorage.setItem(key(projectId), by);
  } catch {
    /* ignore */
  }
}
