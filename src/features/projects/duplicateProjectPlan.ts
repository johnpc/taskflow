import type { TaskRecord } from '../../lib/dataClient';

/** The create payload for copying a task into a DIFFERENT project/section during
 * a project duplication: a fresh TODO carrying title (verbatim, no "(copy)"
 * suffix — the project name already signals the copy), notes, priority, dates,
 * repeat, milestone, and labels. Excludes status/comments/subtasks/deps/
 * assignee. Pure so it's testable. */
export function copyTaskInput(task: TaskRecord, projectId: string, sectionId: string | undefined) {
  return {
    projectId,
    sectionId,
    title: task.title,
    notes: task.notes ?? undefined,
    status: 'TODO' as const,
    priority: task.priority ?? 'NONE',
    startDate: task.startDate ?? undefined,
    dueDate: task.dueDate ?? undefined,
    dueTime: task.dueTime ?? undefined,
    repeat: task.repeat ?? 'NONE',
    isMilestone: task.isMilestone ?? false,
    labelIds: (task.labelIds ?? []).filter((x): x is string => !!x),
    sortOrder: task.sortOrder ?? 0,
  };
}

/** Which tasks a project duplication copies: open, top-level tasks only (drop
 * done tasks and subtasks — the duplicate is a fresh plan, not an archive).
 * Pure. */
export function tasksToCopy(tasks: TaskRecord[]): TaskRecord[] {
  return tasks.filter((t) => t.status !== 'DONE' && !t.parentTaskId);
}
