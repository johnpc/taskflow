/** Pure create-payload builders for the task seed — offset→date mapping and the
 * task/subtask field shaping. Split from seedTasks so that orchestration file
 * stays small (and these stay easy to reason about). */
import { type SeedTask } from './fixtures/workspace';

/** Resolve a day offset (from today) to a YYYY-MM-DD date string in LOCAL time,
 * matching todayISO() (src/features/task/today.ts). Using toISOString() here
 * would format in UTC, so in the evening (UTC already tomorrow) a +0 offset
 * seeded a date the app reads as "tomorrow" — breaking due-today anchors. */
export function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** A subtask fixture (title, or {title, dueOffsetDays, assigned}) → its create
 * payload fields. Keeps the branch out of the create loop so complexity stays low. */
export function subtaskFields(
  sub: string | { title: string; dueOffsetDays?: number; assigned?: boolean },
  members: string[],
) {
  if (typeof sub === 'string') return { title: sub, dueDate: undefined, assigneeEmail: undefined };
  return {
    title: sub.title,
    dueDate: sub.dueOffsetDays === undefined ? undefined : offsetDate(sub.dueOffsetDays),
    assigneeEmail: sub.assigned ? members[0] : undefined,
  };
}

/** Map a task's label names to ids via the seeded registry (unknown dropped). */
export function labelIdsFor(task: SeedTask, labelMap: Map<string, string>): string[] {
  return (task.labels ?? []).map((n) => labelMap.get(n)).filter((x): x is string => !!x);
}

/** The create payload for a top-level seed task (all the offset/flag → field
 * mapping). Extracted so createTaskWithSubtasks stays low-complexity. */
export function taskCreateFields(
  task: SeedTask,
  order: number,
  labelMap: Map<string, string>,
  members: string[],
) {
  return {
    title: task.title,
    notes: task.notes,
    status: task.done ? ('DONE' as const) : ('TODO' as const),
    completedAt: task.done ? new Date().toISOString() : undefined,
    priority: task.priority,
    startDate: task.startOffsetDays === undefined ? undefined : offsetDate(task.startOffsetDays),
    dueDate: task.dueOffsetDays === undefined ? undefined : offsetDate(task.dueOffsetDays),
    sortOrder: order,
    labelIds: labelIdsFor(task, labelMap),
    repeat: task.repeat ?? ('NONE' as const),
    isMilestone: task.isMilestone ?? false,
    assigneeEmail: task.assignedTo ?? (task.assigned ? members[0] : undefined),
    followers: task.following ? [members[0]] : undefined,
  };
}
