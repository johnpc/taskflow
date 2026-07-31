import type { TaskRecord } from '../../lib/dataClient';

/** The create payload for duplicating a task: a fresh TODO copy in the same
 * project/section with " (copy)" appended to the title, carrying notes,
 * priority, dates, labels, repeat, and milestone flag — but NOT status,
 * completedAt, comments, subtasks, or dependencies. Pure so it's testable. */
export function duplicateInput(task: TaskRecord, order: number) {
  return {
    projectId: task.projectId,
    sectionId: task.sectionId || undefined,
    title: `${task.title} (copy)`,
    notes: task.notes ?? undefined,
    status: 'TODO' as const,
    priority: task.priority ?? 'NONE',
    startDate: task.startDate ?? undefined,
    dueDate: task.dueDate ?? undefined,
    dueTime: task.dueTime ?? undefined,
    repeat: task.repeat ?? 'NONE',
    isMilestone: task.isMilestone ?? false,
    labelIds: (task.labelIds ?? []).filter((x): x is string => !!x),
    sortOrder: order,
  };
}

/** The create payload for copying a subtask under a duplicated parent: a fresh
 * TODO child (title kept as-is — no " (copy)" suffix on children) carrying the
 * essentials, parented to newParentId. Pure. */
export function subtaskCopyInput(sub: TaskRecord, newParentId: string, projectId: string) {
  return {
    projectId,
    parentTaskId: newParentId,
    title: sub.title,
    notes: sub.notes ?? undefined,
    status: 'TODO' as const,
    priority: sub.priority ?? 'NONE',
    dueDate: sub.dueDate ?? undefined,
    sortOrder: sub.sortOrder ?? 0,
  };
}
